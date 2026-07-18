import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "./review.controller.js";
import {
  addReviewValidation,
  updateReviewValidation,
} from "./review.validate.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.post("/:productId", protect, addReviewValidation, validate, addReview);

router.patch(
  "/:reviewId",
  protect,
  updateReviewValidation,
  validate,
  updateReview
);

router.delete("/:reviewId", protect, deleteReview);

export default router;
