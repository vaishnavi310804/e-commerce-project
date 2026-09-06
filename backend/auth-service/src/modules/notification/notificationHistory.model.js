import mongoose from "mongoose";

const notificationHistorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "PROMOTIONAL",
      uppercase: true,
      trim: true,
    },
    targetAudience: {
      type: String,
      default: "ALL_CUSTOMERS",
    },
    sentBy: {
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        default: "",
      },
      role: {
        type: String,
        default: "ADMIN",
      },
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

notificationHistorySchema.index({ createdAt: -1 });

export default mongoose.model("NotificationHistory", notificationHistorySchema);
