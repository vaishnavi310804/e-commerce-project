import {
  createOrderService,
  getMyOrdersService,
  getMyOrderDetailsService,
  getAllOrdersService,
  getOrderDetailsService,
  updateOrderStatusService,
  updatePaymentStatusService,
  getOrderStatsService,
  cancelOrderService,
} from "./order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await createOrderService(req.user._id, req.body);
    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await getMyOrdersService(req.user._id);
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrderDetails = async (req, res, next) => {
  try {
    const order = await getMyOrderDetailsService(req.user._id, req.params.id);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersService(req.query);
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await getOrderDetailsService(req.params.id);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const updatedOrder = await updateOrderStatusService(
      req.params.id,
      orderStatus,
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const updatedOrder = await updatePaymentStatusService(
      req.params.id,
      paymentStatus,
    );

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await getOrderStatsService();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const orderId = req.params.id;
    const canceledOrder = await cancelOrderService(userId, orderId);
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: canceledOrder,
    });
  } catch (error) {
    next(error);
  }
};
