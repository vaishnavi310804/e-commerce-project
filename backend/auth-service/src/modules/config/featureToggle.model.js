import mongoose from "mongoose";

const featureToggleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FeatureToggle", featureToggleSchema);
