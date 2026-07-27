import User from "./auth.model.js";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from "./auth.utils.js";
import { generateOTP, hashOTP } from "./auth.utils.js";
import { sendForgotPasswordOTP, sendEmailChangeOTP } from "../../services/email.service.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";

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
    const info = await sendForgotPasswordOTP(user.email, otp);

    console.log("FORGOT PASSWORD OTP EMAIL DELIVERED TO GMAIL:", {
      recipient: user.email,
      messageId: info?.messageId,
      accepted: info?.accepted,
      response: info?.response,
    });

    return {
      emailSent: true,
      info,
    };
  } catch (error) {
    console.error("Failed to send password reset OTP email:", error);

    return {
      emailSent: false,
      otp,
      error: error.message,
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

  if (body.fullName) {
    updateData.fullName = body.fullName;
  }

  if (body.phoneNumber) {
    updateData.phoneNumber = body.phoneNumber;
  }

  if (body.gender) {
    updateData.gender = body.gender;
  }

  if (file && file.buffer) {
    try {
      const result = await uploadToCloudinary(file.buffer, "profiles");
      updateData.profileImage = result.secure_url || result.url;
    } catch (error) {
      console.error("Failed to upload profile image to Cloudinary:", error);
    }
  } else if (body.profileImage) {
    updateData.profileImage = body.profileImage;
  }

  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");
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

export const sendEmailChangeOTPService = async (userId, newEmail) => {
  const user = await User.findById(userId).select(
    "+pendingEmail +emailChangeOTP +emailChangeOTPExpires"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.email === newEmail) {
    throw new Error("New email cannot be the same as your current email.");
  }

  const existingUser = await User.findOne({ email: newEmail });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  const otp = generateOTP();

  user.pendingEmail = newEmail;
  user.emailChangeOTP = hashOTP(otp);
  user.emailChangeOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  try {
    const info = await sendEmailChangeOTP(newEmail, otp);

    console.log("EMAIL CHANGE OTP DELIVERED TO GMAIL:", {
      recipient: newEmail,
      messageId: info?.messageId,
      accepted: info?.accepted,
      response: info?.response,
    });

    return {
      emailSent: true,
      message: "OTP sent successfully.",
      info,
    };
  } catch (error) {
    console.error("Failed to send email change OTP:", error.message);

    return {
      emailSent: false,
      message: "OTP generated successfully.",
      otp,
      error: error.message,
    };
  }
};

export const verifyEmailChangeOTPService = async ({
  userId,
  newEmail,
  otp,
}) => {
  const user = await User.findById(userId).select(
    "+pendingEmail +emailChangeOTP +emailChangeOTPExpires"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.pendingEmail) {
    throw new Error("No pending email change request found.");
  }

  if (user.pendingEmail !== newEmail) {
    throw new Error("Email does not match.");
  }

  if (!user.emailChangeOTP || !user.emailChangeOTPExpires) {
    throw new Error("No OTP found. Please request a new one.");
  }

  if (user.emailChangeOTPExpires < new Date()) {
    throw new Error("OTP has expired.");
  }

  const hashedOTP = hashOTP(otp);

  if (hashedOTP !== user.emailChangeOTP) {
    throw new Error("Invalid OTP.");
  }

  user.email = user.pendingEmail;

  user.pendingEmail = "";
  user.emailChangeOTP = null;
  user.emailChangeOTPExpires = null;

  await user.save();

  return {
    message: "Email updated successfully.",
    email: user.email,
  };
};