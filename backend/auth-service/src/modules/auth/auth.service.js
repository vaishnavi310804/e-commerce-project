import User from "./auth.model.js";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
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
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

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
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.refreshToken;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};


export const logoutUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.refreshToken = null;

  await user.save();

  return true;
};


export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required.");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token.");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token.");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
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
  const decoded =
    verifyPasswordResetToken(resetToken);

  if (decoded.purpose !== "password-reset") {
    throw new Error("Invalid reset token.");
  }

  const user = await User.findById(decoded.id).select(
    "+refreshToken +resetPasswordOTP +resetPasswordOTPExpires"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordOTP = null;
  user.resetPasswordOTPExpires = null;

  user.refreshToken = "";

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

  console.log("Login attempt:", email);

const user = await User.findOne({ email }).select("+password +refreshToken");

console.log("User:", user);

if (!user) {
  throw new Error("Invalid email or password");
}

const isMatch = await comparePassword(password, user.password);

console.log("Password match:", isMatch);

if (!isMatch) {
  throw new Error("Invalid email or password");
}

console.log("Role:", user.role);
  if (user.role !== "ADMIN") {
    throw new Error("Access denied. Admins only.");
  }

  const accessToken = generateAccessToken(user);
console.log("Access token generated");

const refreshToken = generateRefreshToken(user);
console.log("Refresh token generated");


  user.refreshToken = refreshToken;
  console.log("Saving user...");
  await user.save();
  console.log("User saved");

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.refreshToken;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};