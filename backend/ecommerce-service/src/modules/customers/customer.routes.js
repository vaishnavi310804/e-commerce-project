import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  getAllCustomers,
  getCustomerById,
  toggleCustomerStatus,
  getCustomerStats,
} from "./customer.controller.js";

const router = express.Router();

router.get("/stats", protect, authorize("ADMIN"), getCustomerStats);
router.get("/", protect, authorize("ADMIN"), getAllCustomers);
router.get("/:id", protect, authorize("ADMIN"), getCustomerById);
router.patch("/status/:id", protect, authorize("ADMIN"), toggleCustomerStatus);

export default router;
