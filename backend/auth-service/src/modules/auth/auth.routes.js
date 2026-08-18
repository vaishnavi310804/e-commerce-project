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
  sendEmailChangeOtp,
  verifyEmailChangeOtp,
  verifyRegistrationOtp,
  updateFcmToken,
  updateCurrentLocation,
  getAllAdmins
} from "./auth.controller.js";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetOTPValidation,
  resetPasswordValidation,
  updateProfileValidation,
  adminLoginValidation,
  sendEmailChangeOtpValidation,
  verifyEmailChangeOtpValidation,
  verifyRegistrationOtpValidation,
  updateFcmTokenValidation
} from "./auth.validation.js";
import validate from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/admin/login", adminLoginValidation, validate, adminLogin);
router.get(
  "/admins",
  protect,
  authorize("ADMIN"),
  getAllAdmins,
);
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
  validate,
  sendEmailChangeOtp,
);
router.post(
  "/verify-email-change-otp",
  protect,
  verifyEmailChangeOtpValidation,
  validate,
  verifyEmailChangeOtp,
);

router.post(
  "/register/verify",
  verifyRegistrationOtpValidation,
  validate,
  verifyRegistrationOtp
);

router.patch(
  "/fcm-token",
  protect,
  updateFcmTokenValidation,
  updateFcmToken
);

router.patch(
  "/current-location",
  protect,
  updateCurrentLocation
);

export default router;
