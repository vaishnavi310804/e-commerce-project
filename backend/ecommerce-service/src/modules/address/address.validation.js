import { body } from "express-validator";

export const addressValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required."),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15 digits."),

  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required."),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required."),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required.")
    .isLength({ min: 3, max: 10 })
    .withMessage("Invalid postal code format."),
];

export const updateAddressValidation = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty."),

  body("phoneNumber")
    .optional()
    .trim()
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15 digits."),

  body("addressLine1")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 cannot be empty."),

  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty."),

  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty."),

  body("postalCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("Invalid postal code format."),

  body("country")
    .optional()
    .trim(),

  body("addressType")
    .optional()
    .isIn(["Home", "Office", "Other"])
    .withMessage("Invalid address type."),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be true or false."),
];