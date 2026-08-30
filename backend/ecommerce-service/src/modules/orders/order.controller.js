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
  getRefundOrdersService,
  processRefundService,
} from "./order.service.js";
import { sendNotification } from "../../services/notification.service.js";
import { sendCustomerAuditLog } from "../../services/audit.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await createOrderService(req.user._id, req.body);

    if (order?._id) {
      sendCustomerAuditLog({
        actorId: req.user._id,
        actorRole: req.user.role || "CUSTOMER",
        module: "CUSTOMER_ORDER",
        action: "ORDER_CREATED",
        targetId: order._id,
        targetType: "ORDER",
        description: `Placed new order ${order.orderNumber || order._id} (Total: ${order.totalAmount})`,
        changes: { before: null, after: { orderNumber: order.orderNumber, totalAmount: order.totalAmount, paymentMethod: order.paymentMethod } },
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      });
    }

    try {
      await sendNotification({
        userId: req.user._id,
        title: "Order Placed",
        body: "Your order has been placed successfully.",
        type: "ORDER_PLACED",
        data: {
          orderId: order._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to send order notification:",
        notificationError.message,
      );
    }
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
    const canceledOrder = await cancelOrderService(userId, orderId, {
      bankDetails: req.body?.bankDetails,
    });

    if (canceledOrder?._id) {
      sendCustomerAuditLog({
        actorId: userId,
        actorRole: req.user.role || "CUSTOMER",
        module: "CUSTOMER_ORDER",
        action: "ORDER_CANCELLED",
        targetId: canceledOrder._id,
        targetType: "ORDER",
        description: `Cancelled order ${canceledOrder.orderNumber || canceledOrder._id}`,
        changes: { before: { orderStatus: "PENDING" }, after: { orderStatus: "CANCELLED" } },
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: canceledOrder,
    });
  } catch (error) {
    next(error);
  }
};
export const getRefundOrders = async (req, res, next) => {
  try {
    const refunds = await getRefundOrdersService(req.query);

    return res.status(200).json({
      success: true,
      count: refunds.length,
      data: refunds,
    });
  } catch (error) {
    next(error);
  }
};
export const processRefund = async (req, res, next) => {
  try {
    const result = await processRefundService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
