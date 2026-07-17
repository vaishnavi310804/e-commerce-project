import { body } from "express-validator";

export const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be greater than or equal to 0"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be greater than or equal to 0"),

  body("brand")
    .optional()
    .trim(),

  body("productImage")
  .optional()
  .trim(),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false"),
];

export const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be greater than or equal to 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be greater than or equal to 0"),

  body("brand")
    .optional()
    .trim(),

  body("image")
    .optional()
    .trim(),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];