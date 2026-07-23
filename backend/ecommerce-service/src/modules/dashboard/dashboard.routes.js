import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  getDashboardStats,
  getDashboardRevenue,
  getDashboardOrders,
  getDashboardSales,
  getRecentOrders,
  getTopProducts,
  getLowStock,
  getRecentReviews,
  getCustomerGrowth,
} from "./dashboard.controller.js";

const router = express.Router();

router.get("/stats", protect, authorize("ADMIN"), getDashboardStats);
router.get("/revenue", protect, authorize("ADMIN"), getDashboardRevenue);
router.get("/orders", protect, authorize("ADMIN"), getDashboardOrders);
router.get("/sales", protect, authorize("ADMIN"), getDashboardSales);
router.get("/recent-orders", protect, authorize("ADMIN"), getRecentOrders);
router.get("/top-products", protect, authorize("ADMIN"), getTopProducts);
router.get("/low-stock", protect, authorize("ADMIN"), getLowStock);
router.get("/recent-reviews", protect, authorize("ADMIN"), getRecentReviews);
router.get("/customer-growth", protect, authorize("ADMIN"), getCustomerGrowth);

export default router;
