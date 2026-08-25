import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
  {
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

    returnType: {
      type: String,
      enum: ["REFUND", "REPLACEMENT"],
      default: "REFUND",
    },

    replacementOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
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

    refundStatus: {
      type: String,
      enum: ["Not Processed", "Pending", "Processed", "Failed"],
      default: "Not Processed",
    },

    refundMethod: {
      type: String,
      enum: ["RAZORPAY", "BANK_TRANSFER", "UPI"],
      default: "RAZORPAY",
    },

    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
        default: "",
      },
      accountNumber: {
        type: String,
        trim: true,
        default: "",
      },
      ifscCode: {
        type: String,
        trim: true,
        default: "",
      },
      bankName: {
        type: String,
        trim: true,
        default: "",
      },
      upiId: {
        type: String,
        trim: true,
        default: "",
      },
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    razorpayRefundId: {
      type: String,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    pickedUpAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Return = mongoose.model("Return", returnSchema);
export default Return;