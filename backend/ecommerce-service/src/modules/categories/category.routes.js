import express from "express";
import {
  createCategory,
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  updateCategory,
  categoryStatus,
  bulkUpdateCategoryVisibility,
} from "./category.controller.js";
import { createCategoryValidation, updateCategoryValidation } from "./category.validation.js";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";

const router = express.Router();

router.post("/create", protect, authorizePermission("CATEGORIES", "CREATE"), createCategoryValidation, validate, createCategory);

router.get("/", getAllCategories);

router.get("/admin/getAll", protect, authorizePermission("CATEGORIES", "VIEW"), getAllCategoriesAdmin);

router.patch("/bulk-visibility", protect, authorizePermission("CATEGORIES", "EDIT"), bulkUpdateCategoryVisibility);

router.get("/:id", getCategoryById);

router.put("/update/:id", protect, authorizePermission("CATEGORIES", "EDIT"), updateCategoryValidation, validate, updateCategory);

router.patch("/status/:id", protect, authorizePermission("CATEGORIES", "EDIT"), categoryStatus);

export default router;