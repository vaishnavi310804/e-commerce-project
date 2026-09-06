import express from "express";
import { getSessions, revokeSession } from "./session.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only Super Admin can access Session Management.",
    });
  }
  next();
};

router.get("/", protect, requireSuperAdmin, getSessions);
router.delete("/:sessionId", protect, requireSuperAdmin, revokeSession);

export default router;
