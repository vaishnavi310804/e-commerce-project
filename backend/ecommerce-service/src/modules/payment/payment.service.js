import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../orders/order.model.js";
import Cart from "../cart/cart.model.js";
import razorpay from "../../config/razorpay.js";
import { sendNotification } from "../../services/notification.service.js";

export const createRazorpayOrderService = async (
  amount,
  receipt = `receipt_${Date.now()}`,
) => {
  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  };

  return await razorpay.orders.create(options);
};

export const verifyPaymentService = async (
  userId,
  { razorpay_order_id, razorpay_payment_id, razorpay_signature },
) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    const error = new Error("Invalid payment signature.");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
    user: userId,
  });

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentStatus === "Paid") {
    const error = new Error("Payment has already been verified.");
    error.statusCode = 400;
    throw error;
  }

  order.paymentStatus = "Paid";
  order.orderStatus = "Placed";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.paymentDate = new Date();

  await order.save();

  try {
    await sendNotification({
      userId,
      title: "💳 Payment Successful",
      body: `Your payment of ₹${order.totalAmount} for Order #${order.orderNumber} was successful.`,
      type: "PAYMENT_SUCCESS",
      data: {
        orderId: order._id,
      },
    });
  } catch (notificationError) {
    console.error(
      "Failed to send payment notification:",
      notificationError.message,
    );
  }

  await Cart.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        items: [],
      },
    },
    { new: true },
  );

  return await Order.findById(order._id)
    .populate("user", "fullName email phoneNumber")
    .populate("address")
    .populate("products.product", "name price productImage brand");
};
