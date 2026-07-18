import { body } from "express-validator";

export const addReviewValidation = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required.")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5."),

  body("comment")
    .optional({ checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters."),
];

export const updateReviewValidation = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5."),

  body("comment")
    .optional({ checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters."),
];
