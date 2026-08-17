import Return from "./return.model.js";
import Order from "../orders/order.model.js";

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
    const error = new Error(
      "Return can only be requested for a delivered order.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!items || items.length === 0) {
    const error = new Error("At least one item is required for return.");
    error.statusCode = 400;
    throw error;
  }

  const returnItems = [];

  for (const requestedItem of items) {
    const orderItem = order.products.id(requestedItem.orderItemId);

    if (!orderItem) {
      const error = new Error(
        `Order item ${requestedItem.orderItemId} not found.`,
      );
      error.statusCode = 404;
      throw error;
    }

    if (orderItem.itemStatus !== "Delivered") {
      const error = new Error(
        `Item ${requestedItem.orderItemId} is not eligible for return.`,
      );
      error.statusCode = 400;
      throw error;
    }

    if (orderItem.returnStatus !== "Not Requested") {
      const error = new Error(
        `A return has already been requested for item ${requestedItem.orderItemId}.`,
      );
      error.statusCode = 400;
      throw error;
    }

    if (requestedItem.quantity > orderItem.quantity) {
      const error = new Error(
        `Return quantity cannot exceed the ordered quantity for item ${requestedItem.orderItemId}.`,
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      returnItems.some(
        (item) =>
          item.orderItemId.toString() ===
          requestedItem.orderItemId.toString(),
      )
    ) {
      const error = new Error(
        `Duplicate order item ${requestedItem.orderItemId} in return request.`,
      );
      error.statusCode = 400;
      throw error;
    }

    returnItems.push({
      orderItemId: orderItem._id,
      product: orderItem.product,
      quantity: requestedItem.quantity,
      reason: requestedItem.reason,
    });
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

  for (const item of returnItems) {
    const orderItem = order.products.id(item.orderItemId);

    if (orderItem) {
      orderItem.returnStatus = "Requested";
    }
  }

  await order.save();

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
    )
    .populate("items.product", "name price productImage image brand");
};

export const getMyReturnsService = async (userId, query = {}) => {
  const filter = {
    user: userId,
  };

  if (query.status) {
    filter.status = query.status;
  }

  return await Return.find(filter)
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
    )
    .populate("items.product", "name price productImage image brand")
    .sort({ createdAt: -1 });
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

export const getReturnDetailsService = async (returnId) => {
  const returnRequest = await Return.findById(returnId)
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

export const getMyReturnDetailsService = async (userId, returnId) => {
  const returnRequest = await Return.findOne({
    _id: returnId,
    user: userId,
  })
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

export const approveReturnService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.status !== "Pending") {
    const error = new Error(
      `Return cannot be approved because it is currently ${returnRequest.status}.`,
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

  for (const returnItem of returnRequest.items) {
    const orderItem = order.products.id(returnItem.orderItemId);

    if (!orderItem) {
      const error = new Error(
        `Order item ${returnItem.orderItemId} not found.`,
      );
      error.statusCode = 404;
      throw error;
    }

    if (orderItem.returnStatus !== "Requested") {
      const error = new Error(
        `Order item ${returnItem.orderItemId} is not in Requested status.`,
      );
      error.statusCode = 400;
      throw error;
    }

    orderItem.returnStatus = "Approved";
  }

  returnRequest.status = "Approved";
  returnRequest.approvedAt = new Date();

  await order.save();
  await returnRequest.save();

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
    )
    .populate("items.product", "name price productImage image brand");
};

export const rejectReturnService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.status !== "Pending") {
    const error = new Error(
      `Return cannot be rejected because it is currently ${returnRequest.status}.`,
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

  for (const returnItem of returnRequest.items) {
    const orderItem = order.products.id(returnItem.orderItemId);

    if (orderItem) {
      orderItem.returnStatus = "Rejected";
    }
  }

  returnRequest.status = "Rejected";
  returnRequest.rejectedAt = new Date();

  await order.save();
  await returnRequest.save();

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
    )
    .populate("items.product", "name price productImage image brand");
};

export const pickupReturnService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.status !== "Approved") {
    const error = new Error(
      `Return cannot be marked as picked up because it is currently ${returnRequest.status}.`,
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

  for (const returnItem of returnRequest.items) {
    const orderItem = order.products.id(returnItem.orderItemId);

    if (orderItem) {
      orderItem.returnStatus = "Picked Up";
    }
  }

  returnRequest.status = "Picked Up";

  await order.save();
  await returnRequest.save();

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
    )
    .populate("items.product", "name price productImage image brand");
};

export const completeReturnService = async (returnId) => {
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    const error = new Error("Return request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (returnRequest.status !== "Picked Up") {
    const error = new Error(
      `Return cannot be completed because it is currently ${returnRequest.status}.`,
    );
    error.statusCode = 400;
    throw error;
  }

  returnRequest.status = "Completed";
  returnRequest.completedAt = new Date();

  await returnRequest.save();

  return await Return.findById(returnRequest._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus",
    )
    .populate("items.product", "name price productImage image brand");
};