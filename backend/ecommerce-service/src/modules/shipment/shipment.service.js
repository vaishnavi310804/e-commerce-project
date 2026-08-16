import Shipment from "./shipment.model.js";
import Order from "../orders/order.model.js";

const getDefaultTimelineMessage = (status) => {
  switch (status) {
    case "Pending":
      return "Shipment is pending.";

    case "Processing":
      return "Shipment is being processed.";

    case "Shipped":
      return "Package has been handed over to the courier.";

    case "In Transit":
      return "Package is in transit.";

    case "Out for Delivery":
      return "Package is out for delivery.";

    case "Delivered":
      return "Package has been delivered.";

    case "Failed":
      return "Shipment delivery attempt failed.";

    case "Cancelled":
      return "Shipment has been cancelled.";

    default:
      return "Shipment status updated.";
  }
};

export const createShipmentService = async ({
  orderId,
  courier,
  trackingId,
  trackingUrl,
  estimatedDelivery,
}) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order not found.");
    throw error;
  }
  if (order.orderStatus === "Cancelled") {
    const error = new Error("Cannot create shipment for a cancelled order.");
    throw error;
  }

  const existingShipment = await Shipment.findOne({
    order: orderId,
  });
  if (existingShipment) {
    const error = new Error(
      "A shipment already exists for this order.",
    );
    throw error;
}
  const existingTrackingId = await Shipment.findOne({
    trackingId,
  });

  if (existingTrackingId) {
    const error = new Error("A shipment with this tracking ID already exists.");
    throw error;
  }
  const shipment = await Shipment.create({
    order: orderId,
    courier,
    trackingId,
    trackingUrl,
    estimatedDelivery,
    status: "Pending",
    shippedAt: null,
    deliveredAt: null,
    timeline: [
      {
        status: "Pending",
        message: "Shipment created.",
        location: "",
        timestamp: new Date(),
      },
    ],
  });
  return await Shipment.findById(shipment._id).populate(
    "order",
    "orderNumber orderStatus totalAmount paymentMethod paymentStatus shippingAddress",
  );
};

export const getAllShipmentsService = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }
  return await Shipment.find(filter)
    .populate({
      path: "order",
      select:
        "orderNumber orderStatus totalAmount paymentMethod paymentStatus shippingAddress user",
      populate: {
        path: "user",
        select: "fullName email name phoneNumber",
      },
    })
    .sort({ createdAt: -1 });
};

export const getShipmentDetailsService = async (shipmentId) => {
  const shipment = await Shipment.findById(shipmentId)
    .populate({
    path: "order",
    select:
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus shippingAddress user products",
    populate: [
      {
        path: "user",
        select: "fullName email name phoneNumber",
      },
      {
        path: "products.product",
        select: "name price productImage image brand",
      },
    ],
  });
  if (!shipment) {
    const error = new Error("Shipment Details Not Found");
    throw error;
  }
  return shipment;
};

export const updateShipmentStatusService = async (
  shipmentId,
  status,
  message,
  location,
) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    const error = new Error("Shipment Details Not Found");
    error.statusCode = 404;
    throw error;
  }

  const allowedTransitions = {
    Pending: ["Processing", "Shipped", "Cancelled"],
    Processing: ["Shipped", "Failed", "Cancelled"],
    Shipped: ["In Transit", "Out for Delivery", "Failed", "Cancelled"],
    "In Transit": ["Out for Delivery", "Failed", "Cancelled"],
    "Out for Delivery": ["Delivered", "Failed"],
    Delivered: [],
    Failed: ["Processing", "Cancelled"],
    Cancelled: [],
  };

  if (shipment.status === status) {
    const error = new Error(`Shipment is already ${status}.`);
    throw error;
  }

  if (!allowedTransitions[shipment.status]?.includes(status)) {
    const error = new Error(
      `Shipment cannot be changed from "${shipment.status}" to "${status}".`,
    );
    throw error;
  }

  const shipmentOrderStatusMap = {
    Processing: "Processing",
    Shipped: "Shipped",
    "In Transit": "Shipped",
    "Out for Delivery": "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
  };

  const newOrderStatus = shipmentOrderStatusMap[status];

  let order = null;

  if (newOrderStatus) {
    order = await Order.findById(shipment.order);

    if (!order) {
      const error = new Error("Associated order not found.");
      error.statusCode = 404;
      throw error;
    }
  }
  shipment.status = status;

  if (status === "Shipped" && !shipment.shippedAt) {
    shipment.shippedAt = new Date();
  }

  if (status === "Delivered") {
    shipment.deliveredAt = new Date();

    if (!shipment.shippedAt) {
      shipment.shippedAt = new Date();
    }
  }

  const timelineMessage =
    message?.trim() || getDefaultTimelineMessage(status);

  shipment.timeline.push({
    status,
    message: timelineMessage,
    location: location?.trim() || "",
    timestamp: new Date(),
  });

  if (order && newOrderStatus) {
    order.orderStatus = newOrderStatus;

    const itemStatusesToUpdate = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (itemStatusesToUpdate.includes(newOrderStatus)) {
      order.products.forEach((item) => {
        if (item.itemStatus !== "Cancelled") {
          item.itemStatus = newOrderStatus;
        }
      });
    }

    if (
      newOrderStatus === "Delivered" &&
      order.paymentMethod === "COD"
    ) {
      order.paymentStatus = "Paid";
    }
  }

  await shipment.save();

  if (order) {
    await order.save();
  }
  return await Shipment.findById(shipment._id)
    .populate(
      "order",
      "orderNumber orderStatus totalAmount paymentMethod paymentStatus shippingAddress user",
    )
    .populate(
      "order.user",
      "fullName email name phoneNumber",
    );
};
