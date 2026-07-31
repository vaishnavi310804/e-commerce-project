import Order from "../order/order.model.js";
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
      throw new Error("Order not found");
    }
    if (order.paymentStatus === "Paid") {
      throw new Error("Order has already been paid.");
    }
    const razorpayOrder = await createRazorpayOrderService(
      order.totalAmount,
      order.orderNumber,
    );

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();
    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const result = await verifyPaymentService({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id,
    });

    if (!order) {
      throw new Error("Order not found");
    }
    order.paymentStatus = "Paid";
    order.orderStatus = "Placed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentDate = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
