import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actorRole: {
      type: String,
      enum: ["ADMIN", "SUPER_ADMIN"],
      required: true,
    },

    module: {
      type: String,
      default: "ADMIN_USER",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "ADMIN_CREATED",
        "ADMIN_UPDATED",
        "ADMIN_ACTIVATED",
        "ADMIN_DEACTIVATED",
      ],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetType: {
      type: String,
      default: "ADMIN",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    changes: {
      before: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      after: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AuditLog", auditLogSchema);
