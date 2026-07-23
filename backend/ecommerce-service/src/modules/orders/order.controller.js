import {
  getAllOrdersService,
  getOrderDetailsService,
  updateOrderStatusService,
  updatePaymentStatusService,
  getOrderStatsService,
} from "./order.service.js";

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
      orderStatus
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
      paymentStatus
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