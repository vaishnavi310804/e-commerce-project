import { body, param } from "express-validator";

export const createReturnValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required.")
    .isMongoId()
    .withMessage("Invalid order ID."),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required for a return."),

  body("items.*.product")
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid product ID."),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Item quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Item quantity must be at least 1."),

  body("items.*.reason")
    .trim()
    .notEmpty()
    .withMessage("Return reason is required.")
    .isLength({ max: 500 })
    .withMessage("Return reason cannot exceed 500 characters."),

  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Return reason is required.")
    .isLength({ max: 500 })
    .withMessage("Return reason cannot exceed 500 characters."),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),
];

export const returnIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Return ID is required.")
    .isMongoId()
    .withMessage("Invalid return ID."),
];

export const updateReturnStatusValidation = [
  param("id")
    .notEmpty()
    .withMessage("Return ID is required.")
    .isMongoId()
    .withMessage("Invalid return ID."),

  body("status")
    .notEmpty()
    .withMessage("Return status is required.")
    .isIn([
  "Pending",
  "Approved",
  "Rejected",
  "Picked Up",
  "Completed",
])
    .withMessage("Invalid return status."),
];