import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updateProfile,
  adminLogin,
} from "./auth.controller.js";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetOTPValidation,
  resetPasswordValidation,
  updateProfileValidation,
  adminLoginValidation,
} from "./auth.validation.js";
import validate from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/admin/login", adminLoginValidation, validate, adminLogin);
router.post("/login", loginValidation, validate, loginUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  forgotPassword,
);
router.post(
  "/verify-reset-otp",
  verifyResetOTPValidation,
  validate,
  verifyResetOTP,
);
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword,
);
router.patch(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateProfileValidation,
  validate,
  updateProfile,
);
router.post(
  "/send-email-change-otp",
  protect,
  sendEmailChangeOtpValidation,
  validateRequest,
  sendEmailChangeOtp
);

router.post(
  "/verify-email-change-otp",
  protect,
  verifyEmailChangeOtpValidation,
  validateRequest,
  verifyEmailChangeOtp
);

export default router;
