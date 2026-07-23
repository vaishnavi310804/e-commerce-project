import Order from "./order.model.js";

export const getAllOrdersService = async (query = {}) => {
  const filter = {};

  if (query.orderStatus) {
    filter.orderStatus = query.orderStatus;
  }
  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  return await Order.find(filter)
    .populate("user", "fullName email name")
    .populate("address")
    .populate("products.product", "name price productImage image brand")
    .populate("items.product", "name price productImage image brand")
    .sort({ createdAt: -1 });
};

export const getOrderDetailsService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "fullName email name phoneNumber")
    .populate("address")
    .populate("products.product", "name price productImage image brand")
    .populate("items.product", "name price productImage image brand");

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
};

export const updateOrderStatusService = async (orderId, orderStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  order.orderStatus = orderStatus;

  if (orderStatus === "Delivered" && order.paymentMethod === "COD") {
    order.paymentStatus = "Paid";
  }

  await order.save();
  return order;
};

export const updatePaymentStatusService = async (orderId, paymentStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  order.paymentStatus = paymentStatus;
  await order.save();
  return order;
};

export const getOrderStatsService = async () => {
  const orders = await Order.find();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Placed").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "Cancelled").length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
  };
};
