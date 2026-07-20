import express from "express";
import {registerUser, loginUser, getCurrentUser, logoutUser, refreshAccessToken } from "./auth.controller.js";
import {registerValidation, loginValidation, refreshTokenValidation } from "./auth.validation.js";
import validate from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",registerValidation, validate, registerUser);

router.post("/login", loginValidation, validate, loginUser);

router.get("/me", protect, getCurrentUser);

router.post("/logout", protect, logoutUser);

router.post("/refresh-token", refreshTokenValidation, validate, refreshAccessToken);

export default router;