import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";
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

router.get("/stats", protect, authorizePermission("DASHBOARD", "VIEW"), getDashboardStats);
router.get("/revenue", protect, authorizePermission("DASHBOARD", "VIEW"), getDashboardRevenue);
router.get("/orders", protect, authorizePermission("DASHBOARD", "VIEW"), getDashboardOrders);
router.get("/sales", protect, authorizePermission("DASHBOARD", "VIEW"), getDashboardSales);
router.get("/recent-orders", protect, authorizePermission("DASHBOARD", "VIEW"), getRecentOrders);
router.get("/top-products", protect, authorizePermission("DASHBOARD", "VIEW"), getTopProducts);
router.get("/low-stock", protect, authorizePermission("DASHBOARD", "VIEW"), getLowStock);
router.get("/recent-reviews", protect, authorizePermission("DASHBOARD", "VIEW"), getRecentReviews);
router.get("/customer-growth", protect, authorizePermission("DASHBOARD", "VIEW"), getCustomerGrowth);

export default router;
