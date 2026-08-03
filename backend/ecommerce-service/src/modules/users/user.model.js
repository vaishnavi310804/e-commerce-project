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
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
      default: null,
    },

    emailVerificationOTPExpires: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: undefined,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    pendingEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
      select: false,
    },

    emailChangeOTP: {
      type: String,
      select: false,
    },

    emailChangeOTPExpires: {
      type: Date,
      select: false,
    },
    fcmToken: {
      type: String,
      default: "",
    },
    currentLocation: {
    city: String,
    state: String,
    country: String,
    postalCode: String,
    latitude: Number,
    longitude: Number,
},
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
