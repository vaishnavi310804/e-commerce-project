import { body, param } from "express-validator";

export const createShipmentValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required.")
    .isMongoId()
    .withMessage("Invalid order ID."),

  body("courier")
    .trim()
    .notEmpty()
    .withMessage("Courier is required.")
    .isLength({ max: 100 })
    .withMessage("Courier name cannot exceed 100 characters."),

  body("trackingId")
    .trim()
    .notEmpty()
    .withMessage("Tracking ID is required.")
    .isLength({ max: 100 })
    .withMessage("Tracking ID cannot exceed 100 characters."),

  body("trackingUrl")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Tracking URL must be a valid URL."),

  body("estimatedDelivery")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Estimated delivery must be a valid date."),
];

export const updateShipmentStatusValidation = [
  param("id")
    .notEmpty()
    .withMessage("Shipment ID is required.")
    .isMongoId()
    .withMessage("Invalid shipment ID."),

  body("status")
    .notEmpty()
    .withMessage("Shipment status is required.")
    .isIn([
      "Pending",
      "Processing",
      "Shipped",
      "In Transit",
      "Out for Delivery",
      "Delivered",
      "Failed",
      "Cancelled",
    ])
    .withMessage("Invalid shipment status."),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters."),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters."),
];

export const shipmentIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Shipment ID is required.")
    .isMongoId()
    .withMessage("Invalid shipment ID."),
];
