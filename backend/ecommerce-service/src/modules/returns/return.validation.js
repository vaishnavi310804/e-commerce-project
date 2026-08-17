import { body, param } from "express-validator";

const returnStatuses = [
  "Pending",
  "Approved",
  "Rejected",
  "Picked Up",
  "Completed",
];

export const createReturnValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required.")
    .isMongoId()
    .withMessage("Invalid order ID."),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required for return."),

  body("items.*.orderItemId")
    .notEmpty()
    .withMessage("Order item ID is required.")
    .isMongoId()
    .withMessage("Invalid order item ID."),

  body("items.*.product")
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid product ID."),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),

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

export const rejectReturnValidation = [
  param("id")
    .notEmpty()
    .withMessage("Return ID is required.")
    .isMongoId()
    .withMessage("Invalid return ID."),
];

export const approveReturnValidation = [
  param("id")
    .notEmpty()
    .withMessage("Return ID is required.")
    .isMongoId()
    .withMessage("Invalid return ID."),
];