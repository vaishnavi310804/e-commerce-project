import {
  createRazorpayOrderService,
  verifyPaymentService,
} from "./payment.service.js";

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const order = await createRazorpayOrderService(amount);
    res.status(200).json({
      success: true,
      data: order,
      message: "Razorpay order created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const result = await verifyPaymentService(req.body);
    res.status(200).json({
      success: true,
      data: result,
      message: "Payment verified successfully",
    });
  } catch (error) {
    next(error);
  }
};