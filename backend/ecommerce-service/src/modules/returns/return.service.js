import mongoose from "mongoose";
import Return from "./return.model.js";
import Order from "../orders/order.model.js";
import { refundPartialPaymentService } from "../payment/payment.service.js";
import razorpay from "../../config/razorpay.js";
import { sendNotification } from "../../services/notification.service.js";
import { deductProductStock, restoreProductStock } from "../products/product.service.js";

export const createReturnService = async (userId, payload) => {
  const { orderId, items, reason, description, returnType, bankDetails } = payload;
  const finalReturnType = returnType === "REPLACEMENT" ? "REPLACEMENT" : "REFUND";

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

  let savedBankDetails = {
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  };

  let refundMethod = "RAZORPAY";

  if (finalReturnType === "REFUND" && order.paymentMethod === "COD") {
    const upiId = bankDetails?.upiId ? String(bankDetails.upiId).trim() : "";
    const accountHolderName = bankDetails?.accountHolderName
      ? String(bankDetails.accountHolderName).trim()
      : "";
    const accountNumber = bankDetails?.accountNumber
      ? String(bankDetails.accountNumber).trim()
      : "";
    const ifscCode = bankDetails?.ifscCode
      ? String(bankDetails.ifscCode).trim()
      : "";
    const bankName = bankDetails?.bankName
      ? String(bankDetails.bankName).trim()
      : "";

    const hasUpi = Boolean(upiId);
    const bankFields = [accountHolderName, accountNumber, ifscCode, bankName];
    const presentBankFieldsCount = bankFields.filter(Boolean).length;
    const hasCompleteBankDetails = presentBankFieldsCount === 4;

    if (presentBankFieldsCount > 0 && !hasCompleteBankDetails) {
      const error = new Error(
        "Bank refund details are incomplete. Please provide account holder name, account number, IFSC code, and bank name.",
      );
      error.statusCode = 400;
      throw error;
    }

    if (!hasUpi && !hasCompleteBankDetails) {
      const error = new Error(
        "Refund destination details are required for COD refunds.",
      );
      error.statusCode = 400;
      throw error;
    }

    if (hasUpi) {
      refundMethod = "UPI";
      savedBankDetails.upiId = upiId;
    } else {
      refundMethod = "BANK_TRANSFER";
      savedBankDetails.accountHolderName = accountHolderName;
      savedBankDetails.accountNumber = accountNumber;
      savedBankDetails.ifscCode = ifscCode;
      savedBankDetails.bankName = bankName;
    }
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
    returnType: finalReturnType,
    refundMethod,
    bankDetails: savedBankDetails,
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
    .populate("replacementOrder", "orderNumber orderStatus totalAmount products")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus originalOrder products",
    )
    .populate("items.product", "name price productImage image brand");
};

export const getMyReturnsService = async (userId) => {
  return await Return.find({ user: userId })
    .populate("replacementOrder", "orderNumber orderStatus totalAmount products")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus originalOrder products",
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
    .populate("replacementOrder", "orderNumber orderStatus totalAmount products")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus originalOrder shippingAddress products",
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
    .populate("replacementOrder", "orderNumber orderStatus totalAmount products")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus originalOrder products",
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

  if (status === "Completed") {
    if (
      returnRequest.returnType === "REFUND" &&
      returnRequest.refundStatus !== "Processed"
    ) {
      const error = new Error(
        "Return status cannot be updated to Completed until the refund has been processed.",
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      returnRequest.returnType === "REPLACEMENT" &&
      !returnRequest.replacementOrder
    ) {
      const error = new Error(
        "Return status cannot be updated to Completed until the replacement order has been created.",
      );
      error.statusCode = 400;
      throw error;
    }
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
    .populate("replacementOrder", "orderNumber orderStatus totalAmount products")
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

  if (returnRequest.returnType !== "REFUND") {
    const error = new Error(
      "Refund cannot be processed for a replacement return.",
    );
    error.statusCode = 400;
    throw error;
  }

  const validStatuses = ["Approved", "Picked Up"];
  if (!validStatuses.includes(returnRequest.status)) {
    const error = new Error(
      "Refund can only be processed for return requests that are Approved or Picked Up.",
    );
    error.statusCode = 400;
    throw error;
  }

  const targetOrder = await Order.findById(returnRequest.order);

  if (!targetOrder) {
    const error = new Error("Associated order not found.");
    error.statusCode = 404;
    throw error;
  }

  let parentOrder = null;
  if (targetOrder.originalOrder) {
    parentOrder = await Order.findById(targetOrder.originalOrder);
  } else if (
    targetOrder.totalAmount === 0 ||
    targetOrder.products.some((p) => p.price === 0 && p.originalPrice > 0)
  ) {
    const replacementReturn = await Return.findOne({
      replacementOrder: targetOrder._id,
    });
    if (replacementReturn) {
      parentOrder = await Order.findById(replacementReturn.order);
      if (parentOrder && parentOrder.originalOrder) {
        parentOrder =
          (await Order.findById(parentOrder.originalOrder)) || parentOrder;
      }
    }
  }

  if (!parentOrder) {
    if (targetOrder.totalAmount === 0) {
      const error = new Error(
        "Unable to resolve original paid order for replacement return.",
      );
      error.statusCode = 400;
      throw error;
    }
    parentOrder = targetOrder;
  }

  let requestedRefundAmount = 0;

  for (const returnItem of returnRequest.items) {
    const targetItem = targetOrder.products.find(
      (item) =>
        item.product &&
        item.product.toString() === returnItem.product.toString(),
    );

    if (!targetItem) {
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

    if (returnItem.quantity > targetItem.quantity) {
      const error = new Error(
        "Return quantity cannot exceed the ordered quantity.",
      );
      error.statusCode = 400;
      throw error;
    }

    let effectivePrice =
      Number(targetItem.originalPrice) > 0
        ? Number(targetItem.originalPrice)
        : Number(targetItem.price);

    if (
      effectivePrice === 0 &&
      targetOrder._id.toString() !== parentOrder._id.toString()
    ) {
      const parentItem = parentOrder.products.find(
        (item) =>
          item.product &&
          item.product.toString() === returnItem.product.toString(),
      );
      effectivePrice = Number(
        parentItem?.originalPrice > 0
          ? parentItem.originalPrice
          : parentItem?.price || 0,
      );
    }

    if (effectivePrice <= 0) {
      const error = new Error(
        "Original paid price for returned product cannot be determined.",
      );
      error.statusCode = 400;
      throw error;
    }

    requestedRefundAmount += effectivePrice * returnItem.quantity;
  }

  if (requestedRefundAmount <= 0) {
    const error = new Error("Refund amount must be greater than zero.");
    error.statusCode = 400;
    throw error;
  }

  const linkedReplacementOrders = await Order.find({
    originalOrder: parentOrder._id,
  }).select("_id");
  const linkedOrderIds = [
    parentOrder._id,
    ...linkedReplacementOrders.map((o) => o._id),
  ];

  const legacyReturns = await Return.find({
    order: parentOrder._id,
    returnType: "REPLACEMENT",
    replacementOrder: { $ne: null },
  }).select("replacementOrder");

  legacyReturns.forEach((r) => {
    if (
      r.replacementOrder &&
      !linkedOrderIds.some(
        (id) => id.toString() === r.replacementOrder.toString(),
      )
    ) {
      linkedOrderIds.push(r.replacementOrder);
    }
  });

  const processedReturns = await Return.find({
    order: { $in: linkedOrderIds },
    refundStatus: "Processed",
    _id: { $ne: returnRequest._id },
  });

  const alreadyRefunded = processedReturns.reduce(
    (sum, ret) => sum + (Number(ret.refundAmount) || 0),
    0,
  );

  const remainingRefundableBalance = Math.max(
    0,
    (Number(parentOrder.totalAmount) || 0) - alreadyRefunded,
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
      )} for the original order.`,
    );
    error.statusCode = 400;
    throw error;
  }

  const lockedReturn = await Return.findOneAndUpdate(
    {
      _id: returnId,
      returnType: "REFUND",
      refundStatus: { $in: ["Not Processed", "Failed"] },
      status: { $in: ["Approved", "Picked Up"] },
    },
    {
      $set: { refundStatus: "Pending", refundAmount: requestedRefundAmount },
    },
    { returnDocument: "after" },
  );

  if (!lockedReturn) {
    const reFetched = await Return.findById(returnId);
    if (reFetched && reFetched.refundStatus === "Processed") {
      const populatedExisting = await Return.findById(returnId)
        .populate("user", "fullName email phoneNumber")
        .populate(
          "order",
          "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount razorpayRefundId refundDate products",
        )
        .populate(
          "replacementOrder",
          "orderNumber orderStatus totalAmount products",
        )
        .populate("items.product", "name price productImage image brand");

      return {
        message: "Refund has already been processed.",
        data: populatedExisting,
      };
    }

    const error = new Error(
      "Refund request is already in progress or cannot be processed.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (parentOrder.paymentMethod === "RAZORPAY") {
    if (!parentOrder.razorpayPaymentId) {
      await Return.updateOne(
        { _id: returnId },
        { $set: { refundStatus: "Failed" } },
      );
      const error = new Error("Razorpay payment ID not found on original order.");
      error.statusCode = 400;
      throw error;
    }

    let refund;
    try {
      refund = await refundPartialPaymentService(
        parentOrder,
        requestedRefundAmount,
      );
    } catch (refundError) {
      await Return.updateOne(
        { _id: returnId },
        { $set: { refundStatus: "Failed" } },
      );

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
      await Return.updateOne(
        { _id: returnId },
        { $set: { refundStatus: "Failed" } },
      );
      const error = new Error("Refund could not be processed.");
      error.statusCode = 500;
      throw error;
    }

    lockedReturn.razorpayRefundId = refund.id;

    let message =
      "Refund request initiated successfully. The refund is still being processed.";

    if (refund.status === "processed") {
      lockedReturn.refundStatus = "Processed";
      lockedReturn.refundAmount = requestedRefundAmount;
      lockedReturn.refundedAt = new Date();
      lockedReturn.status = "Completed";
      lockedReturn.completedAt = new Date();

      const newCumulativeRefund = alreadyRefunded + requestedRefundAmount;
      parentOrder.refundAmount = newCumulativeRefund;
      parentOrder.razorpayRefundId = refund.id;
      parentOrder.refundStatus = "Processed";
      parentOrder.refundDate = new Date();

      if (newCumulativeRefund >= parentOrder.totalAmount) {
        parentOrder.paymentStatus = "Refunded";
      }

      lockedReturn.items.forEach((returnItem) => {
        const orderItem = targetOrder.products.find(
          (item) =>
            item.product &&
            item.product.toString() === returnItem.product.toString(),
        );

        if (orderItem) {
          orderItem.returnStatus = "Refunded";
        }
      });

      await targetOrder.save();
      await parentOrder.save();
      await lockedReturn.save();

      message = "Refund processed successfully.";

      try {
        await sendNotification({
          userId: lockedReturn.user,
          title: "Refund Processed",
          body: `Your refund for order ${parentOrder.orderNumber} has been processed successfully.`,
          type: "REFUND_PROCESSED",
          data: {
            orderId: parentOrder._id,
          },
        });
      } catch (notificationError) {
        console.error(
          "Failed to send refund notification:",
          notificationError.message,
        );
      }
    } else if (refund.status === "failed") {
      lockedReturn.refundStatus = "Failed";
      await lockedReturn.save();
      const error = new Error("Razorpay refund failed.");
      error.statusCode = 400;
      throw error;
    } else {
      lockedReturn.refundStatus = "Pending";
      lockedReturn.refundAmount = requestedRefundAmount;
      parentOrder.refundStatus = "Pending";
      parentOrder.refundAmount = alreadyRefunded + requestedRefundAmount;
      parentOrder.razorpayRefundId = refund.id;

      await parentOrder.save();
      await lockedReturn.save();

      message =
        "Refund request initiated successfully. The refund is still being processed.";
    }

    const populated = await Return.findById(lockedReturn._id)
      .populate("user", "fullName email phoneNumber")
      .populate(
        "order",
        "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount razorpayRefundId refundDate products",
      )
      .populate(
        "replacementOrder",
        "orderNumber orderStatus totalAmount originalOrder products",
      )
      .populate("items.product", "name price productImage image brand");

    return {
      message,
      data: populated,
    };
  } else if (parentOrder.paymentMethod === "COD") {
    let derivedRefundMethod = "";
    if (lockedReturn.bankDetails?.upiId) {
      derivedRefundMethod = "UPI";
    } else if (
      lockedReturn.bankDetails?.accountHolderName &&
      lockedReturn.bankDetails?.accountNumber &&
      lockedReturn.bankDetails?.ifscCode &&
      lockedReturn.bankDetails?.bankName
    ) {
      derivedRefundMethod = "BANK_TRANSFER";
    } else {
      await Return.updateOne(
        { _id: returnId },
        { $set: { refundStatus: "Not Processed" } },
      );
      const error = new Error(
        "Refund destination details are required for COD refunds.",
      );
      error.statusCode = 400;
      throw error;
    }

    lockedReturn.refundStatus = "Processed";
    lockedReturn.refundMethod = derivedRefundMethod;
    lockedReturn.refundAmount = requestedRefundAmount;
    lockedReturn.refundedAt = new Date();
    lockedReturn.status = "Completed";
    lockedReturn.completedAt = new Date();

    const newCumulativeRefund = alreadyRefunded + requestedRefundAmount;
    parentOrder.refundAmount = newCumulativeRefund;
    parentOrder.refundStatus = "Processed";
    parentOrder.refundDate = new Date();

    if (newCumulativeRefund >= parentOrder.totalAmount) {
      parentOrder.paymentStatus = "Refunded";
    }

    lockedReturn.items.forEach((returnItem) => {
      const orderItem = targetOrder.products.find(
        (item) =>
          item.product &&
          item.product.toString() === returnItem.product.toString(),
      );

      if (orderItem) {
        orderItem.returnStatus = "Refunded";
      }
    });

    await targetOrder.save();
    await parentOrder.save();
    await lockedReturn.save();

    try {
      await sendNotification({
        userId: lockedReturn.user,
        title: "Refund Processed",
        body: `Your refund for order ${parentOrder.orderNumber} has been processed successfully.`,
        type: "REFUND_PROCESSED",
        data: {
          orderId: parentOrder._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to send refund notification:",
        notificationError.message,
      );
    }

    const populated = await Return.findById(lockedReturn._id)
      .populate("user", "fullName email phoneNumber")
      .populate(
        "order",
        "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount refundDate products",
      )
      .populate(
        "replacementOrder",
        "orderNumber orderStatus totalAmount originalOrder products",
      )
      .populate("items.product", "name price productImage image brand");

    return {
      message: "COD refund processed successfully.",
      data: populated,
    };
  } else {
    await Return.updateOne(
      { _id: returnId },
      { $set: { refundStatus: "Not Processed" } },
    );
    const error = new Error("Unsupported payment method for refund.");
    error.statusCode = 400;
    throw error;
  }
};

export const checkReturnRefundStatusService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.returnType !== "REFUND") {
    const error = new Error(
      "Refund status check is not applicable for replacement returns.",
    );
    error.statusCode = 400;
    throw error;
  }

  const targetOrder = await Order.findById(returnRequest.order);

  if (!targetOrder) {
    const error = new Error("Associated order not found.");
    error.statusCode = 404;
    throw error;
  }

  let parentOrder = null;
  if (targetOrder.originalOrder) {
    parentOrder = await Order.findById(targetOrder.originalOrder);
  } else if (
    targetOrder.totalAmount === 0 ||
    targetOrder.products.some((p) => p.price === 0 && p.originalPrice > 0)
  ) {
    const replacementReturn = await Return.findOne({
      replacementOrder: targetOrder._id,
    });
    if (replacementReturn) {
      parentOrder = await Order.findById(replacementReturn.order);
      if (parentOrder && parentOrder.originalOrder) {
        parentOrder =
          (await Order.findById(parentOrder.originalOrder)) || parentOrder;
      }
    }
  }

  if (!parentOrder) {
    parentOrder = targetOrder;
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
      message: "Refund has already been processed.",
      data: populated,
    };
  }

  if (
    returnRequest.refundStatus !== "Pending" ||
    parentOrder.paymentMethod !== "RAZORPAY"
  ) {
    const populated = await Return.findById(returnRequest._id)
      .populate("user", "fullName email phoneNumber")
      .populate(
        "order",
        "orderNumber orderStatus totalAmount paymentMethod paymentStatus refundStatus refundAmount razorpayRefundId refundDate products",
      )
      .populate("items.product", "name price productImage image brand");

    return {
      message: "Refund status check not applicable.",
      data: populated,
    };
  }

  if (!returnRequest.razorpayRefundId) {
    const error = new Error("Razorpay refund ID not found on return request.");
    error.statusCode = 400;
    throw error;
  }

  let razorpayRefund;
  try {
    razorpayRefund = await razorpay.refunds.fetch(
      returnRequest.razorpayRefundId,
    );
  } catch (apiError) {
    console.error("Razorpay fetch refund error:", apiError);
    const error = new Error(
      apiError.error?.description ||
        "Failed to fetch refund status from Razorpay.",
    );
    error.statusCode = 400;
    throw error;
  }

  let message = "";

  if (razorpayRefund.status === "processed") {
    returnRequest.refundStatus = "Processed";
    returnRequest.refundedAt = new Date();
    returnRequest.status = "Completed";
    returnRequest.completedAt = new Date();

    parentOrder.refundStatus = "Processed";
    parentOrder.refundDate = new Date();

    const linkedReplacementOrders = await Order.find({
      originalOrder: parentOrder._id,
    }).select("_id");
    const linkedOrderIds = [
      parentOrder._id,
      ...linkedReplacementOrders.map((o) => o._id),
    ];

    const processedReturns = await Return.find({
      order: { $in: linkedOrderIds },
      refundStatus: "Processed",
      _id: { $ne: returnRequest._id },
    });

    const alreadyRefunded = processedReturns.reduce(
      (sum, ret) => sum + (Number(ret.refundAmount) || 0),
      0,
    );

    const newCumulativeRefund = alreadyRefunded + returnRequest.refundAmount;
    parentOrder.refundAmount = newCumulativeRefund;

    if (newCumulativeRefund >= parentOrder.totalAmount) {
      parentOrder.paymentStatus = "Refunded";
    }

    returnRequest.items.forEach((returnItem) => {
      const orderItem = targetOrder.products.find(
        (item) =>
          item.product &&
          item.product.toString() === returnItem.product.toString(),
      );

      if (orderItem) {
        orderItem.returnStatus = "Refunded";
      }
    });

    await targetOrder.save();
    await parentOrder.save();
    await returnRequest.save();

    try {
      await sendNotification({
        userId: returnRequest.user,
        title: "Refund Processed",
        body: `Your refund for order ${parentOrder.orderNumber} has been processed successfully.`,
        type: "REFUND_PROCESSED",
        data: {
          orderId: parentOrder._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to send refund notification:",
        notificationError.message,
      );
    }

    message = "Refund status verified and marked as Processed.";
  } else if (razorpayRefund.status === "failed") {
    returnRequest.refundStatus = "Failed";
    await returnRequest.save();

    message = "Refund failed. The refund can be retried.";
  } else {
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

export const processReturnReplacementService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.returnType !== "REPLACEMENT") {
    const error = new Error(
      "Replacement order cannot be created for a refund return.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (returnRequest.replacementOrder) {
    const populatedExisting = await Return.findById(returnRequest._id)
      .populate("user", "fullName email phoneNumber")
      .populate(
        "replacementOrder",
        "orderNumber orderStatus totalAmount originalOrder products",
      )
      .populate(
        "order",
        "orderNumber orderStatus totalAmount paymentMethod paymentStatus products",
      )
      .populate("items.product", "name price productImage image brand");

    return {
      message: "Replacement order already exists.",
      data: populatedExisting,
    };
  }

  if (returnRequest.status !== "Picked Up") {
    const error = new Error(
      "Replacement order can only be created after the return has been picked up.",
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

  const rootOriginalOrder = order.originalOrder
    ? (await Order.findById(order.originalOrder)) || order
    : order;

  const tempLockId = new mongoose.Types.ObjectId();

  const lockedReturn = await Return.findOneAndUpdate(
    {
      _id: returnId,
      returnType: "REPLACEMENT",
      replacementOrder: null,
      status: "Picked Up",
    },
    {
      $set: { replacementOrder: tempLockId },
    },
    { returnDocument: "after" },
  );

  if (!lockedReturn) {
    const reFetched = await Return.findById(returnId);
    if (reFetched && reFetched.replacementOrder) {
      const populatedExisting = await Return.findById(returnId)
        .populate("user", "fullName email phoneNumber")
        .populate(
          "replacementOrder",
          "orderNumber orderStatus totalAmount products",
        )
        .populate(
          "order",
          "orderNumber orderStatus totalAmount paymentMethod paymentStatus products",
        )
        .populate("items.product", "name price productImage image brand");

      return {
        message: "Replacement order already exists.",
        data: populatedExisting,
      };
    }

    const error = new Error(
      "Replacement order creation is already in progress or cannot be processed.",
    );
    error.statusCode = 400;
    throw error;
  }

  const replacementItems = lockedReturn.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));

  let stockDeductionSuccess = false;

  try {
    await deductProductStock(replacementItems);
    stockDeductionSuccess = true;

    const replacementOrderProducts = lockedReturn.items.map((item) => {
      const originalOrderItem =
        rootOriginalOrder.products.find(
          (prod) =>
            prod.product &&
            prod.product.toString() === item.product.toString(),
        ) ||
        order.products.find(
          (prod) =>
            prod.product &&
            prod.product.toString() === item.product.toString(),
        );

      const originalPrice = Number(
        originalOrderItem?.originalPrice > 0
          ? originalOrderItem.originalPrice
          : originalOrderItem?.price || 0,
      );

      return {
        product: item.product,
        quantity: item.quantity,
        price: 0,
        originalPrice,
        itemStatus: "Placed",
        returnStatus: "Not Requested",
      };
    });

    const replacementOrder = await Order.create({
      user: lockedReturn.user,
      originalOrder: rootOriginalOrder._id,
      products: replacementOrderProducts,
      subtotal: 0,
      shippingCharge: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      paymentMethod: "COD",
      paymentStatus: "Paid",
      orderStatus: "Placed",
      isStockDeducted: true,
      shippingAddress: order.shippingAddress,
      address: order.address,
    });

    lockedReturn.replacementOrder = replacementOrder._id;
    lockedReturn.status = "Completed";
    lockedReturn.completedAt = new Date();

    lockedReturn.items.forEach((returnItem) => {
      const orderItem = order.products.find(
        (item) =>
          item.product &&
          item.product.toString() === returnItem.product.toString(),
      );

      if (orderItem) {
        orderItem.returnStatus = "Replaced";
      }
    });

    await order.save();
    await lockedReturn.save();
  } catch (error) {
    if (stockDeductionSuccess) {
      try {
        await restoreProductStock(replacementItems);
      } catch (rollbackError) {
        console.error(
          "Failed to restore product stock after replacement creation failure:",
          rollbackError.message,
        );
      }
    }

    await Return.updateOne(
      { _id: returnId, replacementOrder: tempLockId },
      { $set: { replacementOrder: null } },
    );

    throw error;
  }

  const populated = await Return.findById(lockedReturn._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "replacementOrder",
      "orderNumber orderStatus totalAmount originalOrder products",
    )
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus products",
    )
    .populate("items.product", "name price productImage image brand");

  return {
    message: "Replacement order created successfully.",
    data: populated,
  };
};
