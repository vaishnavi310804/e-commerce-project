import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { sendTestNotification } from "./notification.controller.js";

const router = express.Router();

router.post("/test", protect, sendTestNotification);

export default router;