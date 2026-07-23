import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  getAllReviews,
  getReviewById,
  toggleHideReview,
  deleteReview,
  bulkHideReviews,
  bulkDeleteReviews,
  getReviewStats,
} from "./review.controller.js";

const router = express.Router();

router.get("/stats", protect, authorize("ADMIN"), getReviewStats);
router.post("/bulk-hide", protect, authorize("ADMIN"), bulkHideReviews);
router.post("/bulk-delete", protect, authorize("ADMIN"), bulkDeleteReviews);

router.get("/", protect, authorize("ADMIN"), getAllReviews);
router.get("/:id", protect, authorize("ADMIN"), getReviewById);
router.patch("/hide/:id", protect, authorize("ADMIN"), toggleHideReview);
router.delete("/:id", protect, authorize("ADMIN"), deleteReview);

export default router;
