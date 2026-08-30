import User from "./auth.model.js";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from "./auth.utils.js";
import { generateOTP, hashOTP } from "./auth.utils.js";
import {
  sendForgotPasswordOTP,
  sendEmailChangeOTP,
  sendRegistrationOTP,
} from "../../services/email.service.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";

export const registerUserService = async (userData) => {
  const { fullName, email, password, profileImage } = userData;
  const formattedEmail = email ? String(email).trim().toLowerCase() : "";

  const existingUser = await User.findOne({ email: formattedEmail });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new Error("User already exists.");
    }

    const otp = generateOTP();

    existingUser.fullName = fullName;
    existingUser.password = await hashPassword(password);
    if (profileImage !== undefined) {
      existingUser.profileImage = profileImage;
    }

    existingUser.emailVerificationOTP = hashOTP(otp);
    existingUser.emailVerificationOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );
    await existingUser.save();

    try {
      await sendRegistrationOTP(existingUser.email, otp);
      return {
        emailSent: true,
        email: existingUser.email,
        userId: existingUser._id,
      };
    } catch (error) {
      return {
        emailSent: false,
        email: existingUser.email,
        userId: existingUser._id,
        otp,
        error: error.message,
      };
    }
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();

  const user = await User.create({
    fullName,
    email: formattedEmail,
    password: hashedPassword,
    profileImage: profileImage || "",
    isEmailVerified: false,
    emailVerificationOTP: hashOTP(otp),
    emailVerificationOTPExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  try {
    await sendRegistrationOTP(user.email, otp);
    return {
      emailSent: true,
      email: user.email,
      userId: user._id,
    };
  } catch (error) {
    return {
      emailSent: false,
      email: user.email,
      userId: user._id,
      otp,
      error: error.message,
    };
  }
};

export const verifyRegistrationOTPService = async ({ email, otp }) => {
  const formattedEmail = email ? String(email).trim().toLowerCase() : "";
  const formattedOtp = otp ? String(otp).trim() : "";

  const user = await User.findOne({ email: formattedEmail });

  if (!user) {
    throw new Error("User not found.");
  }
  if (user.isEmailVerified) {
    throw new Error("Email is already verified.");
  }
  if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires) {
    throw new Error("No OTP found. Please register again.");
  }

  if (new Date(user.emailVerificationOTPExpires).getTime() < Date.now()) {
    throw new Error("OTP has expired.");
  }

  const hashedOTP = hashOTP(formattedOtp);

  if (hashedOTP !== user.emailVerificationOTP) {
    throw new Error("Invalid OTP.");
  }

  user.isEmailVerified = true;
  user.emailVerificationOTP = null;
  user.emailVerificationOTPExpires = null;

  await user.save();

  const accessToken = generateAccessToken(user);
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.emailVerificationOTP;
  delete userObject.emailVerificationOTPExpires;

  return {
    user: userObject,
    accessToken,
  };
};

export const loginUserService = async ({ email, password }) => {
  const formattedEmail = email ? String(email).trim().toLowerCase() : "";
  const user = await User.findOne({ email: formattedEmail }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in.");
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
  delete userObject.emailVerificationOTP;
  delete userObject.emailVerificationOTPExpires;

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
  const formattedEmail = email ? String(email).trim().toLowerCase() : "";
  const user = await User.findOne({ email: formattedEmail }).select(
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
  const formattedEmail = email ? String(email).trim().toLowerCase() : "";
  const formattedOtp = otp ? String(otp).trim() : "";

  const user = await User.findOne({ email: formattedEmail }).select(
    "+resetPasswordOTP +resetPasswordOTPExpires +isResetOTPVerified"
  );
  if (!user) {
    throw new Error("User not found.");
  }
  if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
    throw new Error("No OTP found. Please request a new one.");
  }
  if (new Date(user.resetPasswordOTPExpires).getTime() < Date.now()) {
    throw new Error("OTP has expired.");
  }

  const hashedOTP = hashOTP(formattedOtp);

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

export const resetPasswordService = async ({ resetToken, newPassword }) => {
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
  const formattedEmail = email ? String(email).trim().toLowerCase() : "";
  const user = await User.findOne({ email: formattedEmail }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new Error("Access denied. Admins only.");
  }

  if (!user.isActive) {
    const error = new Error("Your account has been deactivated.");
    error.statusCode = 403;
    throw error;
  }

  const superAdminCount = await User.countDocuments({ role: "SUPER_ADMIN" });
  if (superAdminCount === 0 && user.role === "ADMIN" && user.isActive) {
    user.role = "SUPER_ADMIN";
    await user.save();
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
  const formattedNewEmail = newEmail ? String(newEmail).trim().toLowerCase() : "";
  const user = await User.findById(userId).select(
    "+pendingEmail +emailChangeOTP +emailChangeOTPExpires"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.email === formattedNewEmail) {
    throw new Error("New email cannot be the same as your current email.");
  }

  const existingUser = await User.findOne({ email: formattedNewEmail });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  const otp = generateOTP();

  user.pendingEmail = formattedNewEmail;
  user.emailChangeOTP = hashOTP(otp);
  user.emailChangeOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  try {
    const info = await sendEmailChangeOTP(formattedNewEmail, otp);

    console.log("EMAIL CHANGE OTP DELIVERED TO GMAIL:", {
      recipient: formattedNewEmail,
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
  const formattedNewEmail = newEmail ? String(newEmail).trim().toLowerCase() : "";
  const formattedOtp = otp ? String(otp).trim() : "";

  const user = await User.findById(userId).select(
    "+pendingEmail +emailChangeOTP +emailChangeOTPExpires"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.pendingEmail) {
    throw new Error("No pending email change request found.");
  }

  if (user.pendingEmail !== formattedNewEmail) {
    throw new Error("Email does not match.");
  }

  if (!user.emailChangeOTP || !user.emailChangeOTPExpires) {
    throw new Error("No OTP found. Please request a new one.");
  }

  if (new Date(user.emailChangeOTPExpires).getTime() < Date.now()) {
    throw new Error("OTP has expired.");
  }

  const hashedOTP = hashOTP(formattedOtp);

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

export const updateFcmTokenService = async (userId, fcmToken) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  const token = fcmToken.trim();
  if (user.fcmToken === token) {
    return user;
  }
  user.fcmToken = token;

  await user.save();

  return user;
};

export const updateCurrentLocationService = async (
  userId,
  currentLocation
) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  user.currentLocation = currentLocation;

  await user.save();

  return user;
};

export const getAllAdminsService = async () => {
  return await User.find(
    { role: { $in: ["ADMIN", "SUPER_ADMIN"] } },
    "_id fullName email role isActive createdAt"
  ).sort({ createdAt: -1 });
};

export const createAdminService = async ({ fullName, email, password }) => {
  if (!fullName || !fullName.trim()) {
    const error = new Error("Full name is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!email || !email.trim()) {
    const error = new Error("Email is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error("Password must be at least 6 characters long.");
    error.statusCode = 400;
    throw error;
  }

  const formattedEmail = String(email).trim().toLowerCase();

  const existingUser = await User.findOne({ email: formattedEmail });
  if (existingUser) {
    const error = new Error("User with this email already exists.");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName: fullName.trim(),
    email: formattedEmail,
    password: hashedPassword,
    role: "ADMIN",
    isActive: true,
    isEmailVerified: true,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const updateAdminService = async (adminId, { fullName, email }) => {
  const user = await User.findById(adminId);
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    const error = new Error("Admin not found.");
    error.statusCode = 404;
    throw error;
  }

  const beforeState = {
    fullName: user.fullName,
    email: user.email,
  };

  if (fullName && fullName.trim()) {
    user.fullName = fullName.trim();
  }

  if (email && email.trim()) {
    const formattedEmail = String(email).trim().toLowerCase();
    if (formattedEmail !== user.email) {
      const existingUser = await User.findOne({
        _id: { $ne: adminId },
        email: formattedEmail,
      });

      if (existingUser) {
        const error = new Error("Email is already in use by another user.");
        error.statusCode = 400;
        throw error;
      }
      user.email = formattedEmail;
    }
  }

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, beforeState };
};

export const updateAdminStatusService = async (adminId, isActive, currentUserId) => {
  if (typeof isActive !== "boolean") {
    const error = new Error("isActive must be a boolean value.");
    error.statusCode = 400;
    throw error;
  }

  const targetUser = await User.findById(adminId);
  if (!targetUser || (targetUser.role !== "ADMIN" && targetUser.role !== "SUPER_ADMIN")) {
    const error = new Error("Admin user not found.");
    error.statusCode = 404;
    throw error;
  }

  const previousIsActive = targetUser.isActive;

  if (currentUserId && currentUserId.toString() === adminId.toString() && isActive === false) {
    const error = new Error("You cannot deactivate your own account.");
    error.statusCode = 400;
    throw error;
  }

  if (isActive === false) {
    const activeAdminCount = await User.countDocuments({
      role: { $in: ["ADMIN", "SUPER_ADMIN"] },
      isActive: true,
    });

    if (activeAdminCount <= 1) {
      const error = new Error("Cannot deactivate the last active admin.");
      error.statusCode = 400;
      throw error;
    }
  }

  targetUser.isActive = isActive;
  await targetUser.save();

  const userObj = targetUser.toObject();
  delete userObj.password;
  return { user: userObj, previousIsActive };
};
