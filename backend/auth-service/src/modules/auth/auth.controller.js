import { registerUserService, loginUserService, logoutUserService} from "./auth.service.js";

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

export const getCurrentUser = async (req, res) => {
  try{
    return res.status(200).json({
    success: true,
    data: req.user,
  });
  }catch(err){
    next(error)
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