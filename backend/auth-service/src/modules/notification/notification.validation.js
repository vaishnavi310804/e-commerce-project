import { body } from "express-validator";

export const createNotificationValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required."),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),

  body("body")
    .trim()
    .notEmpty()
    .withMessage("Body is required."),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Notification type is required."),

  body("image")
    .optional()
    .isString(),

  body("data")
    .optional()
    .isObject(),
];