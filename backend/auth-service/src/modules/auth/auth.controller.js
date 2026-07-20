import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshTokenService,
  forgotPasswordService,
  verifyResetOTPService,
  resetPasswordService
} from "./auth.service.js";


export const registerUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } =
      await registerUserService(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } =
      await loginUserService(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await refreshTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      data: tokens,
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

    const { resetToken } =
      await verifyResetOTPService({
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
