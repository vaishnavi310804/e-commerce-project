import { registerUserService, loginUserService } from "./auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await registerUserService(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await loginUserService(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};