import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";
import {
  getAllReviews,
  getReviewById,
  toggleHideReview,
  deleteReview,
  bulkHideReviews,
  bulkDeleteReviews,
  getReviewStats,
  getProductReviews,
  createReview,
  updateReview,
  deleteMyReview
} from "./review.controller.js";
import { createReviewValidation, updateReviewValidation } from "./review.validate.js";
import validate from "../../middleware/validate.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/product/:productId", protect, createReviewValidation, validate ,createReview);
router.put("/product/:productId", protect, updateReviewValidation, validate ,updateReview);
router.delete("/product/:productId", protect, deleteMyReview);


router.get("/stats", protect, authorizePermission("REVIEWS", "VIEW"), getReviewStats);
router.post("/bulk-hide", protect, authorizePermission("REVIEWS", "EDIT"), bulkHideReviews);
router.post("/bulk-delete", protect, authorizePermission("REVIEWS", "DELETE"), bulkDeleteReviews);
router.get("/", protect, authorizePermission("REVIEWS", "VIEW"), getAllReviews);
router.get("/:id", protect, authorizePermission("REVIEWS", "VIEW"), getReviewById);
router.patch("/hide/:id", protect, authorizePermission("REVIEWS", "EDIT"), toggleHideReview);
router.delete("/:id", protect, authorizePermission("REVIEWS", "DELETE"), deleteReview);

export default router;
