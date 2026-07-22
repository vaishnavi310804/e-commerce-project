import { body } from "express-validator";

export const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];

export const refreshTokenValidation = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required."),
];

export const forgotPasswordValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email."),
];

export const verifyResetOTPValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email."),

  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits.")
    .isNumeric()
    .withMessage("OTP must contain only numbers."),
];

export const resetPasswordValidation = [
  body("resetToken")
    .notEmpty()
    .withMessage("Reset token is required."),

  body("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

export const updateProfileValidation = [
  body("phoneNumber")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other", "Prefer not to say"])
    .withMessage("Invalid gender"),
];

export const adminLoginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];