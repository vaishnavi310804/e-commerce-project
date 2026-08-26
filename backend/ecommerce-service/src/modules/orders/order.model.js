import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemNumber: {
    type: String,
    unique: true,
    trim: true,
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

  price: {
    type: Number,
    required: true,
  },

  originalPrice: {
    type: Number,
    default: 0,
  },

  itemStatus: {
    type: String,
    enum: [
      "Placed",
      "Confirmed",
      "Processing",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ],
    default: "Placed",
  },

  returnStatus: {
    type: String,
    enum: [
      "Not Requested",
      "Requested",
      "Approved",
      "Rejected",
      "Picked Up",
      "Refunded",
      "Replaced",
    ],
    default: "Not Requested",
  },
});

orderItemSchema.pre("validate", function () {
  if (!this.itemNumber) {
    this.itemNumber = `SE-ITM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    products: [orderItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    refundStatus: {
      type: String,
      enum: ["Not Applicable", "Pending", "Processed", "Failed"],
      default: "Not Applicable",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },

    razorpayRefundId: {
      type: String,
    },

    refundDate: {
      type: Date,
    },
    refundMethod: {
      type: String,
      default: "",
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      upiId: String,
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Placed",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    isStockDeducted: {
      type: Boolean,
      default: false,
    },

    shippingAddress: {
      fullName: String,
      phoneNumber: String,
      streetAddress: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", function () {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `SE-INV-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
  }
});

orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    this.orderNumber = `SE-ORD-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
