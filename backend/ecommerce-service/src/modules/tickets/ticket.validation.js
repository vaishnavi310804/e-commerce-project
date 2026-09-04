import { body, param, query } from "express-validator";

export const createTicketValidation = [
  body("orderId")
    .optional()
    .isMongoId()
    .withMessage("Invalid order ID."),

  body("category")
    .isIn([
      "Shipment Delay",
      "Delivery Issue",
      "Refund Delay",
      "Payment Issue",
      "Return Issue",
      "Order Issue",
      "Product Issue",
      "Cancellation Issue",
      "Other",
    ])
    .withMessage("Invalid ticket category."),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required.")
    .isLength({ max: 150 })
    .withMessage("Subject cannot exceed 150 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Critical"])
    .withMessage("Invalid ticket priority."),

  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array."),
];

export const ticketIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ticket ID."),
];

export const updateTicketStatusValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ticket ID."),

  body("status")
    .isIn(["Open", "In Progress", "Resolved", "Closed"])
    .withMessage("Invalid ticket status."),

  body("resolution")
    .optional()
    .trim(),
];

export const updateTicketPriorityValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ticket ID."),

  body("priority")
    .isIn(["Low", "Medium", "High", "Critical"])
    .withMessage("Invalid ticket priority."),
];

export const escalateTicketValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ticket ID."),

  body("targetAdminId")
    .notEmpty()
    .withMessage("Target admin ID is required.")
    .isMongoId()
    .withMessage("Invalid target admin ID."),
];

export const assignTicketValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ticket ID."),

  body("assignedTo")
    .isMongoId()
    .withMessage("Invalid admin ID."),
];

export const ticketQueryValidation = [
  query("status")
    .optional()
    .isIn(["Open", "In Progress", "Resolved", "Closed"])
    .withMessage("Invalid ticket status."),

  query("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Critical"])
    .withMessage("Invalid ticket priority."),

  query("category")
    .optional()
    .isIn([
      "Shipment Delay",
      "Delivery Issue",
      "Refund Delay",
      "Payment Issue",
      "Return Issue",
      "Order Issue",
      "Product Issue",
      "Cancellation Issue",
      "Other",
    ])
    .withMessage("Invalid ticket category."),

  query("isEscalated")
    .optional()
    .isBoolean()
    .withMessage("isEscalated must be a boolean."),
];