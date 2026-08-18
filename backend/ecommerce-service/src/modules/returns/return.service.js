import Return from "./return.model.js";
import Order from "../orders/order.model.js";
import { refundPartialPaymentService } from "../payment/payment.service.js";
import razorpay from "../../config/razorpay.js";
import { sendNotification } from "../../services/notification.service.js";

export const createReturnService = async (userId, payload) => {
  const { orderId, items, reason, description } = payload;

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (order.orderStatus !== "Delivered") {
    const error = new Error("Only delivered orders are eligible for return.");
    error.statusCode = 400;
    throw error;
  }

  if (!items || items.length === 0) {
    const error = new Error("At least one item is required for a return.");
    error.statusCode = 400;
    throw error;
  }

  const returnItems = [];

  for (const requestedItem of items) {
    const orderItem = order.products.find(
      (item) =>
        item.product &&
        item.product.toString() === requestedItem.product.toString(),
    );

    if (!orderItem) {
      const error = new Error(
        "One or more products do not belong to this order.",
      );
      error.statusCode = 400;
      throw error;
    }

    if (requestedItem.quantity > orderItem.quantity) {
      const error = new Error(
        "Return quantity cannot exceed the ordered quantity.",
      );
      error.statusCode = 400;
      throw error;
    }

    if (orderItem.returnStatus !== "Not Requested") {
      const error = new Error(
        "One or more selected products already have a return request.",
      );
      error.statusCode = 400;
      throw error;
    }

    returnItems.push({
      product: orderItem.product,
      quantity: requestedItem.quantity,
      reason: requestedItem.reason,
    });
  }

  const existingReturn = await Return.findOne({
    order: order._id,
    status: {
      $in: ["Pending", "Approved", "Picked Up"],
    },
    "items.product": {
      $in: returnItems.map((item) => item.product),
    },
  });

  if (existingReturn) {
    const error = new Error(
      "A return request already exists for one or more selected products.",
    );
    error.statusCode = 400;
    throw error;
  }

  const returnRequest = await Return.create({
    order: order._id,
    user: userId,
    items: returnItems,
    reason,
    description,
    status: "Pending",
    refundStatus: "Not Processed",
    requestedAt: new Date(),
  });

  returnItems.forEach((returnItem) => {
    const orderItem = order.products.find(
      (item) =>
        item.product &&
        item.product.toString() === returnItem.product.toString(),
    );

    if (orderItem) {
      orderItem.returnStatus = "Requested";
    }
  });

  await order.save();

  try {
  await sendNotification({
    userId,
    title: "Return Request Initiated",
    body: `Your return request for Order #${order.orderNumber} has been initiated successfully.`,
    type: "RETURN_REQUESTED",
    data: {
      orderId: order._id,
      returnId: returnRequest._id,
    },
  });
} catch (notificationError) {
  console.error(
    "Failed to send return notification:",
    notificationError.message,
  );
}

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus products",
    )
    .populate("items.product", "name price productImage image brand");
};

export const getMyReturnsService = async (userId) => {
  return await Return.find({ user: userId })
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus products",
    )
    .populate("items.product", "name price productImage image brand")
    .sort({ createdAt: -1 });
};

export const getReturnDetailsService = async (userId, returnId) => {
  const filter = userId
    ? {
        _id: returnId,
        user: userId,
      }
    : {
        _id: returnId,
      };

  const returnRequest = await Return.findOne(filter)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus shippingAddress products",
    )
    .populate("items.product", "name price productImage image brand");

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  return returnRequest;
};

export const getAllReturnsService = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  return await Return.find(filter)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus products",
    )
    .populate("items.product", "name price productImage image brand")
    .sort({ createdAt: -1 });
};

export const updateReturnStatusService = async (returnId, status) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  const allowedTransitions = {
    Pending: ["Approved", "Rejected"],
    Approved: ["Picked Up"],
    Rejected: [],
    "Picked Up": ["Completed"],
    Completed: [],
  };

  if (returnRequest.status === status) {
    const error = new Error(`Return request is already ${status}.`);
    error.statusCode = 400;
    throw error;
  }

  if (!allowedTransitions[returnRequest.status]?.includes(status)) {
    const error = new Error(
      `Return cannot be changed from "${returnRequest.status}" to "${status}".`,
    );
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(returnRequest.order);

  if (!order) {
    const error = new Error("Associated order not found.");
    error.statusCode = 404;
    throw error;
  }

  returnRequest.status = status;

  if (status === "Approved") {
    returnRequest.approvedAt = new Date();
  }

  if (status === "Rejected") {
    returnRequest.rejectedAt = new Date();
  }

  if (status === "Picked Up") {
    returnRequest.pickedUpAt = new Date();
  }

  if (status === "Completed") {
    returnRequest.completedAt = new Date();
  }

  returnRequest.items.forEach((returnItem) => {
    const orderItem = order.products.find(
      (item) =>
        item.product &&
        item.product.toString() === returnItem.product.toString(),
    );

    if (!orderItem) {
      return;
    }

    switch (status) {
      case "Approved":
        orderItem.returnStatus = "Approved";
        break;

      case "Rejected":
        orderItem.returnStatus = "Rejected";
        break;

      case "Picked Up":
        orderItem.returnStatus = "Picked Up";
        break;

      default:
        break;
    }
  });

  await returnRequest.save();
  await order.save();

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus products",
    )
    .populate("items.product", "name price productImage image brand");
};

export const processReturnRefundService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.status !== "Picked Up") {
    const error = new Error(
      "Refund can only be processed after the return has been picked up.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (returnRequest.refundStatus === "Processed") {
    const error = new Error("This return has already been refunded.");
    error.statusCode = 400;
    throw error;
  }

  if (returnRequest.refundStatus === "Pending") {
    const error = new Error(
      "Refund request is already pending. Please check the refund status instead.",
    );
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(returnRequest.order);

  if (!order) {
    const error = new Error("Associated order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentMethod !== "RAZORPAY") {
    const error = new Error(
      "Refund is only available for Razorpay payments.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (order.paymentStatus !== "Paid" && order.paymentStatus !== "Refunded") {
    const error = new Error(
      "This order payment is not eligible for refund.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!order.razorpayPaymentId) {
    const error = new Error("Razorpay payment ID not found.");
    error.statusCode = 400;
    throw error;
  }

  let requestedRefundAmount = 0;

  for (const returnItem of returnRequest.items) {
    const orderItem = order.products.find(
      (item) =>
        item.product &&
        item.product.toString() === returnItem.product.toString(),
    );

    if (!orderItem) {
      const error = new Error(
        "One or more returned products were not found in the order.",
      );
      error.statusCode = 400;
      throw error;
    }

    if (!returnItem.quantity || returnItem.quantity < 1) {
      const error = new Error("Return quantity must be at least 1.");
      error.statusCode = 400;
      throw error;
    }

    if (returnItem.quantity > orderItem.quantity) {
      const error = new Error(
        "Return quantity cannot exceed the ordered quantity.",
      );
      error.statusCode = 400;
      throw error;
    }

    requestedRefundAmount += orderItem.price * returnItem.quantity;
  }

  if (requestedRefundAmount <= 0) {
    const error = new Error("Refund amount must be greater than zero.");
    error.statusCode = 400;
    throw error;
  }

  const processedReturns = await Return.find({
    order: returnRequest.order,
    refundStatus: "Processed",
    _id: { $ne: returnRequest._id },
  });

  const alreadyRefunded = processedReturns.reduce(
    (sum, ret) => sum + (Number(ret.refundAmount) || 0),
    0,
  );

  const remainingRefundableBalance = Math.max(
    0,
    (Number(order.totalAmount) || 0) - alreadyRefunded,
  );

  if (remainingRefundableBalance <= 0) {
    const error = new Error("This order has no remaining refundable balance.");
    error.statusCode = 400;
    throw error;
  }

  if (requestedRefundAmount > remainingRefundableBalance) {
    const error = new Error(
      `Requested refund of ₹${requestedRefundAmount.toFixed(
        2,
      )} exceeds the remaining refundable balance of ₹${remainingRefundableBalance.toFixed(
        2,
      )} for this order.`,
    );
    error.statusCode = 400;
    throw error;
  }

  returnRequest.refundStatus = "Pending";
  returnRequest.refundAmount = requestedRefundAmount;
  await returnRequest.save();

  let refund;
  try {
    refund = await refundPartialPaymentService(order, requestedRefundAmount);
  } catch (refundError) {
    returnRequest.refundStatus = "Failed";
    await returnRequest.save();

    const message =
      refundError.error?.description ||
      refundError.description ||
      refundError.message ||
      "Razorpay refund failed.";
    const customError = new Error(message);
    customError.statusCode = refundError.statusCode || 400;
    throw customError;
  }

  if (!refund) {
    returnRequest.refundStatus = "Failed";
    await returnRequest.save();
    const error = new Error("Refund could not be processed.");
    error.statusCode = 500;
    throw error;
  }

  returnRequest.razorpayRefundId = refund.id;

  let message =
    "Refund request initiated successfully. The refund is still being processed.";

  if (refund.status === "processed") {
    returnRequest.refundStatus = "Processed";
    returnRequest.refundAmount = requestedRefundAmount;
    returnRequest.refundedAt = new Date();
    returnRequest.status = "Completed";
    returnRequest.completedAt = new Date();

    const newCumulativeRefund = alreadyRefunded + requestedRefundAmount;
    order.refundAmount = newCumulativeRefund;
    order.razorpayRefundId = refund.id;
    order.refundStatus = "Processed";
    order.refundDate = new Date();

    if (newCumulativeRefund >= order.totalAmount) {
      order.paymentStatus = "Refunded";
    }

    returnRequest.items.forEach((returnItem) => {
      const orderItem = order.products.find(
        (item) =>
          item.product &&
          item.product.toString() === returnItem.product.toString(),
      );

      if (orderItem) {
        orderItem.returnStatus = "Refunded";
      }
    });

    await order.save();
    await returnRequest.save();

    message = "Refund processed successfully.";
  } else if (refund.status === "failed") {
    returnRequest.refundStatus = "Failed";
    await returnRequest.save();
    const error = new Error("Razorpay refund failed.");
    error.statusCode = 400;
    throw error;
  } else {
    returnRequest.refundStatus = "Pending";
    returnRequest.refundAmount = requestedRefundAmount;
    order.refundStatus = "Pending";
    order.refundAmount = alreadyRefunded + requestedRefundAmount;
    order.razorpayRefundId = refund.id;

    await order.save();
    await returnRequest.save();

    message =
      "Refund request initiated successfully. The refund is still being processed.";
  }

  const populated = await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount razorpayRefundId refundDate products",
    )
    .populate("items.product", "name price productImage image brand");

  return {
    message,
    data: populated,
  };
};

export const checkReturnRefundStatusService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  const order = await Order.findById(returnRequest.order);

  if (!order) {
    const error = new Error("Associated order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.refundStatus === "Processed") {
    const populated = await Return.findById(returnRequest._id)
      .populate("user", "fullName email phoneNumber")
      .populate(
        "order",
        "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount razorpayRefundId refundDate products",
      )
      .populate("items.product", "name price productImage image brand");

    return {
      message: "Refund processed successfully.",
      data: populated,
    };
  }

  const refundId = returnRequest.razorpayRefundId || order.razorpayRefundId;

  if (!refundId) {
    const error = new Error("Razorpay refund ID not found for this return.");
    error.statusCode = 400;
    throw error;
  }

  let refund;
  try {
    refund = await razorpay.refunds.fetch(refundId);
  } catch (fetchError) {
    const msg =
      fetchError.error?.description ||
      fetchError.description ||
      fetchError.message ||
      "Failed to fetch refund status from Razorpay.";
    const customError = new Error(msg);
    customError.statusCode = fetchError.statusCode || 400;
    throw customError;
  }

  let message = "Refund is still being processed.";

  if (refund.status === "processed") {
    returnRequest.refundStatus = "Processed";
    returnRequest.refundedAt = returnRequest.refundedAt || new Date();
    returnRequest.status = "Completed";
    returnRequest.completedAt = returnRequest.completedAt || new Date();

    const processedReturns = await Return.find({
      order: returnRequest.order,
      refundStatus: "Processed",
      _id: { $ne: returnRequest._id },
    });

    const alreadyRefunded = processedReturns.reduce(
      (sum, ret) => sum + (Number(ret.refundAmount) || 0),
      0,
    );

    const newCumulativeRefund =
      alreadyRefunded + (returnRequest.refundAmount || 0);

    order.refundAmount = newCumulativeRefund;
    order.razorpayRefundId = refund.id;
    order.refundStatus = "Processed";
    order.refundDate = new Date();

    if (newCumulativeRefund >= order.totalAmount) {
      order.paymentStatus = "Refunded";
    }

    returnRequest.items.forEach((returnItem) => {
      const orderItem = order.products.find(
        (item) =>
          item.product &&
          item.product.toString() === returnItem.product.toString(),
      );

      if (orderItem) {
        orderItem.returnStatus = "Refunded";
      }
    });

    await order.save();
    await returnRequest.save();

    message = "Refund processed successfully.";
  } else if (refund.status === "failed") {
    returnRequest.refundStatus = "Failed";
    await returnRequest.save();

    message = "Refund failed. The refund can be retried.";
  } else {
    returnRequest.refundStatus = "Pending";
    await returnRequest.save();

    message = "Refund is still being processed.";
  }

  const populated = await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount razorpayRefundId refundDate products",
    )
    .populate("items.product", "name price productImage image brand");

  return {
    message,
    data: populated,
  };
};
