import { body } from "express-validator";

export const createOrderValidation = [
  body("addressId")
    .notEmpty()
    .withMessage("Address ID is required.")
    .isMongoId()
    .withMessage("Invalid address ID format."),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required.")
    .isIn(["COD", "RAZORPAY"])
    .withMessage("Invalid payment method."),
];

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