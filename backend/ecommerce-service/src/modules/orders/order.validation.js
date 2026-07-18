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