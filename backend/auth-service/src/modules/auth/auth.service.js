import User from "./auth.model.js";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from "./auth.utils.js";
import { generateOTP, hashOTP } from "./auth.utils.js";
import { sendForgotPasswordOTP } from "../../services/email.service.js";

export const registerUserService = async (userData) => {
  const { fullName, email, password, profileImage } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    profileImage,
  });

  const accessToken = generateAccessToken(user);

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
  };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("User has been logged out");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user);

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
  };
};

export const logoutUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return true;
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email }).select(
    "+resetPasswordOTP +resetPasswordOTPExpires"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  const otp = generateOTP();

  user.resetPasswordOTP = hashOTP(otp);
  user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  try {
    await sendForgotPasswordOTP(user.email, otp);

    return {
      emailSent: true,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.error("Failed to send password reset OTP email:", error.message);

    return {
      emailSent: false,
      otp,
    };
  }
};

export const verifyResetOTPService = async ({ email, otp }) => {
  const user = await User.findOne({ email }).select(
    "+resetPasswordOTP +resetPasswordOTPExpires +isResetOTPVerified"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
    throw new Error("No OTP found. Please request a new one.");
  }

  if (user.resetPasswordOTPExpires < new Date()) {
    throw new Error("OTP has expired.");
  }

  const hashedOTP = hashOTP(otp);

  if (hashedOTP !== user.resetPasswordOTP) {
    throw new Error("Invalid OTP.");
  }

  const resetToken = generatePasswordResetToken(user);

  user.resetPasswordOTP = null;
  user.resetPasswordOTPExpires = null;
  await user.save();

  return {
    resetToken,
  };
};

export const resetPasswordService = async ({
  resetToken,
  newPassword,
}) => {
  const decoded = verifyPasswordResetToken(resetToken);

  if (decoded.purpose !== "password-reset") {
    throw new Error("Invalid reset token.");
  }

  const user = await User.findById(decoded.id).select(
    "+resetPasswordOTP +resetPasswordOTPExpires"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordOTP = null;
  user.resetPasswordOTPExpires = null;

  await user.save();
};

export const updateProfileService = async (userId, body, file) => {
  const updateData = {
    isProfileCompleted: true,
  };

  if (body.phoneNumber) {
    updateData.phoneNumber = body.phoneNumber;
  }

  if (body.gender) {
    updateData.gender = body.gender;
  }

  if (file) {
    updateData.profileImage = file.path;
  }

  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });
};

export const adminLoginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Access denied. Admins only.");
  }

  const accessToken = generateAccessToken(user);

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
  };
};