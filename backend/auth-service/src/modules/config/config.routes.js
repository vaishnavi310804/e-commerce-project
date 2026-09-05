import express from "express";
import { getFeatureToggles, updateFeatureToggle } from "./config.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/features", protect, getFeatureToggles);
router.patch("/features/:key", protect, updateFeatureToggle);

export default router;
