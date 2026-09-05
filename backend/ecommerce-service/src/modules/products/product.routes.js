import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  productStatus,
  bulkUpdateProductVisibility,
  getAllProductsAdmin,
  getProductsByCategory,
} from "./product.controller.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";
import { checkAdminFeatureEnabled } from "../../middleware/featureToggle.middleware.js";
import {
  createProductValidation,
  updateProductValidation,
} from "./product.validation.js";
import validate from "../../middleware/validate.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  authorizePermission("PRODUCTS", "CREATE"),
  checkAdminFeatureEnabled("PRODUCTS"),
  upload.single("productImage"),
  createProductValidation,
  validate,
  createProduct,
);

router.get("/", getAllProducts);

router.get("/category/:categoryId", getProductsByCategory);

router.get("/admin/getAll", protect, authorizePermission("PRODUCTS", "VIEW"), checkAdminFeatureEnabled("PRODUCTS"), getAllProductsAdmin);

router.patch("/bulk-visibility", protect, authorizePermission("PRODUCTS", "EDIT"), checkAdminFeatureEnabled("PRODUCTS"), bulkUpdateProductVisibility);

router.get("/:id", getProductById);

router.put(
  "/update/:id",
  protect,
  authorizePermission("PRODUCTS", "EDIT"),
  checkAdminFeatureEnabled("PRODUCTS"),
  upload.single("productImage"),
  updateProductValidation,
  validate,
  updateProduct,
);

router.patch("/status/:id", protect, authorizePermission("PRODUCTS", "EDIT"), checkAdminFeatureEnabled("PRODUCTS"), productStatus);

export default router;
