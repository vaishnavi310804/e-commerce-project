import { body } from "express-validator";

export const updateOrderStatusValidation = [
  body("orderStatus")
    .notEmpty()
    .withMessage("Order status is required")
    .isIn([
      "Pending",
      "Placed",
      "Confirmed",
      "Processing",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ])
    .withMessage("Invalid order status"),
];

export const updatePaymentStatusValidation = [
  body("paymentStatus")
    .notEmpty()
    .withMessage("Payment status is required")
    .isIn(["Pending", "Paid", "Failed", "Refunded"])
    .withMessage("Invalid payment status"),
];