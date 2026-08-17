import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
  {
    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const returnSchema = new mongoose.Schema(
  {
    returnNumber: {
      type: String,
      unique: true,
      trim: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [returnItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one item is required for a return.",
      },
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Picked Up",
        "Completed",
      ],
      default: "Pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
    },

    rejectedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

returnSchema.pre("save", function () {
  if (!this.returnNumber) {
    this.returnNumber = `SE-RET-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
  }
});

const Return = mongoose.model("Return", returnSchema);

export default Return;