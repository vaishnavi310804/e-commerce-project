import mongoose from "mongoose";

const ticketMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    attachments: [
      {
        url: {
          type: String,
          trim: true,
        },
        publicId: {
          type: String,
          trim: true,
        },
        fileName: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    category: {
      type: String,
      enum: [
        "Shipment Delay",
        "Delivery Issue",
        "Refund Delay",
        "Payment Issue",
        "Return Issue",
        "Order Issue",
        "Product Issue",
        "Cancellation Issue",
        "Other",
      ],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    attachments: [
      {
        url: {
          type: String,
          trim: true,
        },
        publicId: {
          type: String,
          trim: true,
        },
        fileName: {
          type: String,
          trim: true,
        },
      },
    ],

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isEscalated: {
      type: Boolean,
      default: false,
    },

    escalatedAt: {
      type: Date,
      default: null,
    },

    slaDeadline: {
      type: Date,
      default: null,
    },

    slaBreached: {
      type: Boolean,
      default: false,
    },

    messages: [ticketMessageSchema],

    resolution: {
      type: String,
      trim: true,
      default: "",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

ticketSchema.pre("save", function () {
  if (!this.ticketNumber) {
    this.ticketNumber = `SE-TKT-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
  }
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;