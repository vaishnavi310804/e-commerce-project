import {
  registerUserService,
  loginUserService,
  logoutUserService,
  forgotPasswordService,
  verifyResetOTPService,
  resetPasswordService,
  updateProfileService,
  adminLoginService,
  sendEmailChangeOTPService,
  verifyEmailChangeOTPService,
  verifyRegistrationOTPService,
  updateFcmTokenService,
  updateCurrentLocationService,
  getAllAdminsService,
  createAdminService,
  updateAdminService,
  updateAdminStatusService,
} from "./auth.service.js";
import { createAuditLog } from "../audit/auditLog.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const result = await registerUserService(req.body);

    if (result?.userId) {
      createAuditLog({
        actorId: result.userId,
        actorRole: "CUSTOMER",
        module: "CUSTOMER_AUTH",
        action: "CUSTOMER_REGISTERED",
        targetId: result.userId,
        targetType: "CUSTOMER",
        description: `Registered new customer account: ${result.email}`,
        changes: { before: null, after: { email: result.email } },
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      });
    }

    return res.status(201).json({
      success: true,
      message: result?.emailSent
        ? "Registration successful. Please verify your email."
        : "Registration successful. OTP generated successfully.",
      data:
        result?.emailSent || process.env.NODE_ENV === "production"
          ? {
              email: result.email,
            }
          : {
              email: result.email,
              otp: result.otp,
            },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyRegistrationOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { user, accessToken } = await verifyRegistrationOTPService({
      email,
      otp,
    });
    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { user, accessToken } = await loginUserService(req.body);

    if (user?._id) {
      createAuditLog({
        actorId: user._id,
        actorRole: user.role || "CUSTOMER",
        module: "CUSTOMER_AUTH",
        action: "CUSTOMER_LOGIN",
        targetId: user._id,
        targetType: "CUSTOMER",
        description: `Customer logged in: ${user.email}`,
        changes: null,
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await logoutUserService(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  console.log("Forgot Password API Hit");
  console.log(req.body);
  try {
    const { email } = req.body;

    const result = await forgotPasswordService(email);

    return res.status(200).json({
      success: true,
      message: result?.emailSent
        ? "OTP sent successfully."
        : "OTP generated successfully. Email sending is not configured.",
      data:
        result?.emailSent || process.env.NODE_ENV === "production"
          ? undefined
          : {
              otp: result?.otp,
            },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const { resetToken } = await verifyResetOTPService({
      email,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      data: {
        resetToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    await resetPasswordService({
      resetToken,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateProfileService(req.user._id, req.body, req.file);

    if (user?._id) {
      createAuditLog({
        actorId: user._id,
        actorRole: user.role || "CUSTOMER",
        module: "CUSTOMER_PROFILE",
        action: "CUSTOMER_PROFILE_UPDATED",
        targetId: user._id,
        targetType: "CUSTOMER",
        description: `Updated profile details for ${user.email}`,
        changes: { before: null, after: { fullName: user.fullName, email: user.email } },
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const data = await adminLoginService(req.body);

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      data,
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendEmailChangeOtp = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const newEmail = req.body.newEmail || req.body.email;

    const result = await sendEmailChangeOTPService(userId, newEmail);

    return res.status(200).json({
      success: true,
      message: result?.emailSent
        ? "OTP sent successfully."
        : "OTP generated successfully. Email sending is not configured.",
      data:
        result?.emailSent || process.env.NODE_ENV === "production"
          ? undefined
          : {
              otp: result?.otp,
            },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailChangeOtp = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const newEmail = req.body.newEmail || req.body.email;
    const otp = req.body.otp;

    const result = await verifyEmailChangeOTPService({
      userId,
      newEmail,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: result?.message || "Email updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    await updateFcmTokenService(req.user._id, fcmToken);
    res.status(200).json({
      success: true,
      message: "FCM token updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCurrentLocation = async (req, res, next) => {
  try {
    const user = await updateCurrentLocationService(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Current location updated successfully.",
      data: user.currentLocation,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await getAllAdminsService();

    return res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const admin = await createAdminService(req.body);

    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "";
    const userAgent = req.headers["user-agent"] || "";

    createAuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      module: "ADMIN_USER",
      action: "ADMIN_CREATED",
      targetId: admin._id,
      targetType: "ADMIN",
      description: `Created new admin user: ${admin.email}`,
      changes: {
        before: null,
        after: {
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive,
        },
      },
      ipAddress,
      userAgent,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { user: updatedAdmin, beforeState } = await updateAdminService(
      req.params.id,
      req.body
    );

    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "";
    const userAgent = req.headers["user-agent"] || "";

    createAuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      module: "ADMIN_USER",
      action: "ADMIN_UPDATED",
      targetId: updatedAdmin._id,
      targetType: "ADMIN",
      description: `Updated admin details for ${updatedAdmin.email}`,
      changes: {
        before: beforeState,
        after: {
          fullName: updatedAdmin.fullName,
          email: updatedAdmin.email,
        },
      },
      ipAddress,
      userAgent,
    });

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully.",
      data: updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const currentUserId = req.user._id || req.user.id;
    const { user: admin, previousIsActive } = await updateAdminStatusService(
      req.params.id,
      isActive,
      currentUserId
    );

    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "";
    const userAgent = req.headers["user-agent"] || "";

    const action = admin.isActive ? "ADMIN_ACTIVATED" : "ADMIN_DEACTIVATED";
    const description = `${
      admin.isActive ? "Activated" : "Deactivated"
    } admin account for ${admin.email}`;

    createAuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      module: "ADMIN_USER",
      action,
      targetId: admin._id,
      targetType: "ADMIN",
      description,
      changes: {
        before: { isActive: previousIsActive },
        after: { isActive: admin.isActive },
      },
      ipAddress,
      userAgent,
    });

    return res.status(200).json({
      success: true,
      message: `Admin ${
        admin.isActive ? "activated" : "deactivated"
      } successfully.`,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};
