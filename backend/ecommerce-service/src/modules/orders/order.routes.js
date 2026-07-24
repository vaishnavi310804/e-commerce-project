import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.js";
import {
  createOrderValidation,
  updateOrderStatusValidation,
  updatePaymentStatusValidation,
} from "./order.validation.js";
import {
  createOrder,
  getMyOrders,
  getMyOrderDetails,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
} from "./order.controller.js";

const router = express.Router();

// Customer Order Routes
router.post("/", protect, createOrderValidation, validate, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/my-orders/:id", protect, getMyOrderDetails);

router.get("/stats", protect, authorize("ADMIN"), getOrderStats);

router.patch(
  "/status/:id",
  protect,
  authorize("ADMIN"),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus,
);

router.patch(
  "/payment-status/:id",
  protect,
  authorize("ADMIN"),
  updatePaymentStatusValidation,
  validate,
  updatePaymentStatus,
);

router.patch(
  "/admin/status/:id",
  protect,
  authorize("ADMIN"),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus,
);

router.patch(
  "/admin/payment-status/:id",
  protect,
  authorize("ADMIN"),
  updatePaymentStatusValidation,
  validate,
  updatePaymentStatus,
);

router.patch(
  "/admin/:id/status",
  protect,
  authorize("ADMIN"),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus,
);

router.patch(
  "/admin/:id/payment-status",
  protect,
  authorize("ADMIN"),
  updatePaymentStatusValidation,
  validate,
  updatePaymentStatus,
);

router.get("/", protect, authorize("ADMIN"), getAllOrders);
router.get("/admin/all", protect, authorize("ADMIN"), getAllOrders);
router.get("/admin/:id", protect, authorize("ADMIN"), getOrderDetails);
router.get("/:id", protect, authorize("ADMIN"), getOrderDetails);

export default router;
