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

  itemStatus: {
    type: String,
    enum: [
      "Placed",
      "Confirmed",
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
    ],
    default: "Not Requested",
  },
});

orderItemSchema.pre("validate", function () {
  if (!this.itemNumber) {
    this.itemNumber =
      `SE-ITM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
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
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
