import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrderService = async (
  amount,
  receipt = `receipt_${Date.now()}`
) => {
  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  };
  const order = await razorpay.orders.create(options);
  return order;
};

export const verifyPaymentService = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }
  return {
    verified: true,
    razorpay_order_id,
    razorpay_payment_id,
  };
};