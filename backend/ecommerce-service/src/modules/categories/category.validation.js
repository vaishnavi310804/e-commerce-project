import { body } from "express-validator";

const CATEGORY_NAME_REGEX = /^[a-zA-Z0-9\s\-&'.,()/]+$/;

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters")
    .bail()
    .matches(CATEGORY_NAME_REGEX)
    .withMessage(
      "Category name can only contain letters, numbers, spaces, hyphens, ampersands, apostrophes, commas, periods, slashes, and parentheses"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters")
    .bail()
    .matches(CATEGORY_NAME_REGEX)
    .withMessage(
      "Invalid category name."
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];