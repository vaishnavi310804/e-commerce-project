import { body } from "express-validator";

export const createOrderValidation = [
  body("addressId")
    .notEmpty()
    .withMessage("Address is required."),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required.")
    .isIn(["COD", "ONLINE"])
    .withMessage("Invalid payment method."),
];


export const updateOrderStatusValidation = [
  body("orderStatus")
    .isIn([
      "Placed",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ])
    .withMessage("Invalid order status."),
];