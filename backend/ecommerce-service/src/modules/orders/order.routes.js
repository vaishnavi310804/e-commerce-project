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
  cancelOrder,
  getRefundOrders,
  processRefund,
} from "./order.controller.js";

const router = express.Router();

router.post("/", protect, createOrderValidation, validate, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/my-orders/:id", protect, getMyOrderDetails);
router.patch("/:id/cancel", protect, cancelOrder);
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
  "/:id/payment-status",
  protect,
  authorize("ADMIN"),
  updatePaymentStatusValidation,
  validate,
  updatePaymentStatus,
);

router.get("/", protect, authorize("ADMIN"), getAllOrders);
router.get("/refunds", protect, authorize("ADMIN"), getRefundOrders);

router.post("/:id/refund", protect, authorize("ADMIN"), processRefund);
router.get("/:id", protect, authorize("ADMIN"), getOrderDetails);

export default router;
