import Return from "./return.model.js";
import Order from "../orders/order.model.js";
import { refundPartialPaymentService } from "../payment/payment.service.js";


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
  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
    )
    .populate("items.product", "name price productImage image brand");
};

export const getMyReturnsService = async (userId) => {
  return await Return.find({ user: userId })
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
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
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus shippingAddress",
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
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
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
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
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

  if (returnRequest.status !== "Approved") {
    const error = new Error(
      "Refund can only be processed for an approved return.",
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

  if (order.paymentStatus !== "Paid") {
    const error = new Error(
      "This order payment is not eligible for refund.",
    );
    error.statusCode = 400;
    throw error;
  }
  let refundAmount = 0;

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

    if (returnItem.quantity > orderItem.quantity) {
      const error = new Error(
        "Return quantity cannot exceed the ordered quantity.",
      );
      error.statusCode = 400;
      throw error;
    }

    refundAmount += orderItem.price * returnItem.quantity;
  }

  if (refundAmount <= 0) {
    const error = new Error("Refund amount must be greater than zero.");
    error.statusCode = 400;
    throw error;
  }

  const refund = await refundPartialPaymentService(
    order,
    refundAmount,
  );

  if (!refund) {
    const error = new Error("Refund could not be processed.");
    error.statusCode = 500;
    throw error;
  }

  order.refundStatus =
    refund.status === "processed" ? "Processed" : "Pending";

  order.refundAmount = refundAmount;
  order.razorpayRefundId = refund.id;

  if (refund.status === "processed") {
    order.paymentStatus = "Refunded";
    order.refundDate = new Date();
  }

  returnRequest.items.forEach((returnItem) => {
    const orderItem = order.products.find(
      (item) =>
        item.product &&
        item.product.toString() === returnItem.product.toString(),
    );

    if (orderItem && refund.status === "processed") {
      orderItem.returnStatus = "Refunded";
    }
  });

  if (refund.status === "processed") {
    returnRequest.status = "Completed";
    returnRequest.completedAt = new Date();
  }

  await order.save();
  await returnRequest.save();

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount razorpayRefundId refundDate",
    )
    .populate(
      "items.product",
      "name price productImage image brand",
    );
};