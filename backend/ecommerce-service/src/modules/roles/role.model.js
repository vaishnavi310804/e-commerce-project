import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    actions: {
      type: [String],
      default: ["VIEW"],
    },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    permissions: [permissionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Role", roleSchema);
