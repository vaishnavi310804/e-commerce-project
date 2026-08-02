import Order from "../orders/order.model.js";
import {
  createRazorpayOrderService,
  verifyPaymentService,
} from "./payment.service.js";

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }

    if (order.paymentStatus === "Paid") {
      const error = new Error("Order has already been paid.");
      error.statusCode = 400;
      throw error;
    }

    const razorpayOrder = await createRazorpayOrderService(
      order.totalAmount,
      order.orderNumber
    );

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully.",
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const order = await verifyPaymentService(req.user._id, req.body);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};