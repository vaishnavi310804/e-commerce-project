import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";
import {
  getAllCustomers,
  getCustomerById,
  toggleCustomerStatus,
  getCustomerStats,
} from "./customer.controller.js";

const router = express.Router();

router.get("/stats", protect, authorizePermission("CUSTOMERS", "VIEW"), getCustomerStats);
router.get("/", protect, authorizePermission("CUSTOMERS", "VIEW"), getAllCustomers);
router.get("/:id", protect, authorizePermission("CUSTOMERS", "VIEW"), getCustomerById);
router.patch("/status/:id", protect, authorizePermission("CUSTOMERS", "EDIT"), toggleCustomerStatus);

export default router;
