import express from "express";
import { getAuditLogs, createInternalAuditLog } from "./auditLog.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../../../ecommerce-service/src/middleware/role.middleware.js";
import { verifyServiceKey } from "../../middleware/serviceAuth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  getAuditLogs
);

router.post("/internal", verifyServiceKey, createInternalAuditLog);

export default router;
