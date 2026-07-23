import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

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
    items: [orderItemSchema],

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
      enum: ["COD", "ONLINE", "Card", "UPI"],
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
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  if ((!this.products || this.products.length === 0) && this.items && this.items.length > 0) {
    this.products = this.items;
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;