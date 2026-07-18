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
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number."),

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
    .isPostalCode("IN")
    .withMessage("Invalid postal code."),
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
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number."),

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
    .isPostalCode("IN")
    .withMessage("Invalid postal code."),

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