import express from "express";
import { getAuditLogs } from "./auditLog.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../../../ecommerce-service/src/middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  getAuditLogs
);

export default router;
