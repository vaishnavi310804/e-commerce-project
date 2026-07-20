import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshTokenService,
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