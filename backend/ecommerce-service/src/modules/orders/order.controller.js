import { createOrderService, getMyOrdersService, getOrderByIdService, cancelOrderService } from "./order.service.js"

export const createOrder = async (req, res, next) => {
  try {
    const order = await createOrderService(
      req.user._id,
      req.body.addressId,
      req.body.paymentMethod
    );

    res.status(201).json({
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

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await getOrderByIdService(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await cancelOrderService(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};