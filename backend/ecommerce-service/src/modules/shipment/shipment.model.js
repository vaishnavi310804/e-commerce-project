import mongoose from "mongoose";

const shipmentTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Delivered",
        "Failed",
        "Cancelled",
      ],
      required: true,
    },

    message: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    courier: {
      type: String,
      required: true,
      trim: true,
    },

    trackingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    trackingUrl: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Delivered",
        "Failed",
        "Cancelled",
      ],
      default: "Pending",
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    estimatedDelivery: {
      type: Date,
      default: null,
    },

    timeline: {
      type: [shipmentTimelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
