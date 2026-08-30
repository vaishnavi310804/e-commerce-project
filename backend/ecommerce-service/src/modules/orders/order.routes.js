import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";
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
  cancelOrder,
  getRefundOrders,
  processRefund,
} from "./order.controller.js";

const router = express.Router();

router.post("/", protect, createOrderValidation, validate, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/my-orders/:id", protect, getMyOrderDetails);
router.patch("/:id/cancel", protect, cancelOrder);
router.get("/stats", protect, authorizePermission("ORDERS", "VIEW"), getOrderStats);

router.patch(
  "/status/:id",
  protect,
  authorizePermission("ORDERS", "EDIT"),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus,
);

router.patch(
  "/payment-status/:id",
  protect,
  authorizePermission("ORDERS", "EDIT"),
  updatePaymentStatusValidation,
  validate,
  updatePaymentStatus,
);

router.patch(
  "/:id/payment-status",
  protect,
  authorizePermission("ORDERS", "EDIT"),
  updatePaymentStatusValidation,
  validate,
  updatePaymentStatus,
);

router.get("/", protect, authorizePermission("ORDERS", "VIEW"), getAllOrders);
router.get("/refunds", protect, authorizePermission("REFUNDS", "VIEW"), getRefundOrders);

router.post("/:id/refund", protect, authorizePermission("REFUNDS", "EDIT"), processRefund);
router.get("/:id", protect, authorizePermission("ORDERS", "VIEW"), getOrderDetails);

export default router;
