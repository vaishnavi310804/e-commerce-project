import express from "express";
import {registerUser, loginUser, getCurrentUser, logoutUser, refreshAccessToken, forgotPassword, verifyResetOTP, resetPassword } from "./auth.controller.js";
import {registerValidation, loginValidation, refreshTokenValidation, forgotPasswordValidation, verifyResetOTPValidation, resetPasswordValidation } from "./auth.validation.js";
import validate from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",registerValidation, validate, registerUser);

router.post("/login", loginValidation, validate, loginUser);

router.get("/me", protect, getCurrentUser);

router.post("/logout", protect, logoutUser);

router.post("/refresh-token", refreshTokenValidation, validate, refreshAccessToken);

router.post("/forgot-password", forgotPasswordValidation, validate, forgotPassword );

router.post("/verify-reset-otp", verifyResetOTPValidation, validate, verifyResetOTP );

router.post("/reset-password", resetPasswordValidation, validate, resetPassword );

export default router;