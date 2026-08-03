import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  sendTestNotification,
  createNotification
} from "./notification.controller.js";
import validate  from "../../middleware/validate.js";
import { createNotificationValidation } from "./notification.validation.js";

const router = express.Router();

router.use(protect);

router.post("/test", sendTestNotification);

router.post(
  "/send",
  createNotificationValidation,
  validate,
  createNotification,
);

router.get("/", getNotifications);

router.get("/unread-count", getUnreadNotificationCount);

router.patch("/read-all", markAllNotificationsRead);

router.patch("/:id/read", markNotificationRead);

router.delete("/:id", deleteNotification);

export default router;
