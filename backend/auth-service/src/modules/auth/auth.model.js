import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    profileImage: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordOTP: {
      type: String,
      select: false,
    },
    isResetOTPVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    resetPasswordOTPExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
