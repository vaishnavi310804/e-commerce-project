import { body } from "express-validator";

const ROLE_NAME_REGEX = /^[a-zA-Z0-9\s\-&'_]+$/;

export const createRoleValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Role name is required")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Role name must be between 2 and 50 characters")
    .bail()
    .matches(ROLE_NAME_REGEX)
    .withMessage("Role name contains invalid characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("permissions")
    .isArray()
    .withMessage("Permissions must be an array of module permission objects"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

export const updateRoleValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Role name cannot be empty")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Role name must be between 2 and 50 characters")
    .bail()
    .matches(ROLE_NAME_REGEX)
    .withMessage("Role name contains invalid characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array of module permission objects"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];
