import Order from "./order.model.js";
import Cart from "../cart/cart.model.js";
import Address from "../address/address.model.js";
import { refundPaymentService, checkRefundStatusService } from "../../modules/payment/payment.service.js";
import { sendNotification } from "../../services/notification.service.js";

export const createOrderService = async (userId, payload) => {
  const { addressId, paymentMethod = "COD" } = payload;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || !cart.items || cart.items.length === 0) {
    const error = new Error("Cart is empty.");
    error.statusCode = 400;
    throw error;
  }
  const addressDoc = await Address.findOne({
    _id: addressId,
    user: userId,
  });
  if (!addressDoc) {
    const error = new Error("Shipping address not found.");
    error.statusCode = 404;
    throw error;
  }

  let rawSubtotal = 0;
  let rawDiscount = 0;

  const orderProducts = cart.items.map((item) => {
    const product = item.product;

    if (!product) {
      throw new Error("One or more products in your cart are unavailable.");
    }

    const price = product.price || 0;

    const unitPrice =
      product.discountPrice > 0 && product.discountPrice < price
        ? product.discountPrice
        : price;

    rawSubtotal += price * item.quantity;

    if (product.discountPrice > 0 && product.discountPrice < price) {
      rawDiscount += (price - product.discountPrice) * item.quantity;
    }

    return {
      product: product._id,
      quantity: item.quantity,
      price: unitPrice,
      itemStatus: "Placed",
      returnStatus: "Not Requested",
    };
  });

  const shippingCharge = 0;
  const tax = 0;
  const subtotal = rawSubtotal;
  const discount = rawDiscount;
  const totalAmount = subtotal - discount + shippingCharge + tax;

  const shippingAddressSnapshot = {
    fullName: addressDoc.fullName,
    phoneNumber: addressDoc.phoneNumber,
    streetAddress: `${addressDoc.addressLine1}${
      addressDoc.addressLine2 ? ", " + addressDoc.addressLine2 : ""
    }`,
    city: addressDoc.city,
    state: addressDoc.state,
    postalCode: addressDoc.postalCode,
    country: addressDoc.country,
  };
  const order = await Order.create({
    user: userId,
    products: orderProducts,
    subtotal,
    shippingCharge,
    tax,
    discount,
    totalAmount,
    paymentMethod,
    paymentStatus: "Pending",
    orderStatus: paymentMethod === "COD" ? "Placed" : "Pending",
    shippingAddress: shippingAddressSnapshot,
    address: addressDoc._id,
  });
  await Cart.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        items: [],
      },
    },
    { new: true },
  );
  return await Order.findById(order._id)
    .populate("user", "fullName email phoneNumber")
    .populate("address")
    .populate("products.product", "name price productImage image brand");
};

export const getMyOrdersService = async (userId) => {
  return await Order.find({ user: userId })
    .populate("address")
    .populate("products.product", "name price productImage image brand")
    .sort({ createdAt: -1 });
};

export const getMyOrderDetailsService = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate("user", "fullName email phoneNumber")
    .populate("address")
    .populate("products.product", "name price productImage image brand");

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const getAllOrdersService = async (query = {}) => {
  const filter = {};

  if (query.orderStatus) {
    filter.orderStatus = query.orderStatus;
  }
  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  return await Order.find(filter)
    .populate("user", "fullName email name")
    .populate("address")
    .populate("products.product", "name price productImage image brand")
    .sort({ createdAt: -1 });
};

export const getOrderDetailsService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "fullName email name phoneNumber")
    .populate("address")
    .populate("products.product", "name price productImage image brand");

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const updateOrderStatusService = async (orderId, orderStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  order.orderStatus = orderStatus;

  const itemStatuses = [
    "Placed",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (itemStatuses.includes(orderStatus)) {
    order.products.forEach((item) => {
      item.itemStatus = orderStatus;
    });
  }

  if (orderStatus === "Delivered" && order.paymentMethod === "COD") {
    order.paymentStatus = "Paid";
  }

  await order.save();

  try {
    switch (orderStatus) {
      case "Shipped":
        await sendNotification({
          userId: order.user,
          title: "Order Shipped",
          body: `Your order #${order.orderNumber} has been shipped.`,
          type: "ORDER_SHIPPED",
          data: {
            orderId: order._id,
          },
        });
        break;

      case "Delivered":
        await sendNotification({
          userId: order.user,
          title: "Order Delivered",
          body: `Your order #${order.orderNumber} has been delivered.`,
          type: "ORDER_DELIVERED",
          data: {
            orderId: order._id,
          },
        });
        break;

      default:
        break;
    }
  } catch (notificationError) {
    console.error(
      "Failed to send order status notification:",
      notificationError.message,
    );
  }

  return order;
};

export const updatePaymentStatusService = async (orderId, paymentStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  order.paymentStatus = paymentStatus;
  await order.save();
  return order;
};

export const getOrderStatsService = async () => {
  const orders = await Order.find();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Pending" || o.orderStatus === "Placed",
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "Delivered",
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.orderStatus === "Cancelled",
  ).length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
  };
};

export const cancelOrderService = async (userId, orderId) => {
  const filter = userId ? { _id: orderId, user: userId } : { _id: orderId };
  const order = await Order.findOne(filter);

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }
  const cancellableStatus = [
    "Pending",
    "Placed",
    "Confirmed",
    "Processing",
    "Packed",
  ];

  if (!cancellableStatus.includes(order.orderStatus)) {
    const error = new Error("This order cannot be cancelled.");
    error.statusCode = 400;
    throw error;
  }
  order.orderStatus = "Cancelled";
  const cancellableItemStatus = ["Placed", "Confirmed", "Processing", "Packed"];
  order.products.forEach((item) => {
    if (cancellableItemStatus.includes(item.itemStatus)) {
      item.itemStatus = "Cancelled";
    }
  });

  await order.save();
  if (order.paymentMethod === "RAZORPAY" && order.paymentStatus === "Paid") {
    try {
    await refundPaymentService(order);
  } catch (refundError) {
    console.error(
      "Refund failed after order cancellation:",
      refundError.message
    );
  }
}
  return order;
};

export const getRefundOrdersService = async (query = {}) => {
  const filter = {
    refundStatus: {
      $in: ["Pending", "Processed", "Failed"],
    },
  };

  if (query.refundStatus) {
    filter.refundStatus = query.refundStatus;
  }

  return await Order.find(filter)
    .populate("user", "fullName email phoneNumber")
    .populate("products.product", "name price productImage brand")
    .sort({ updatedAt: -1 });
};


export const processRefundService = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentMethod !== "RAZORPAY") {
    const error = new Error(
      "Refund is only available for Razorpay payments.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (order.razorpayRefundId) {
    const refund = await checkRefundStatusService(order);

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "fullName email phoneNumber")
      .populate(
        "products.product",
        "name price productImage brand",
      );

    return {
      order: updatedOrder,
      refund,
    };
  }

  if (order.paymentStatus !== "Paid") {
    const error = new Error(
      "This payment is not eligible for a refund.",
    );
    error.statusCode = 400;
    throw error;
  }

  const refund = await refundPaymentService(order);

  const updatedOrder = await Order.findById(order._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "products.product",
      "name price productImage brand",
    );

  return {
    order: updatedOrder,
    refund,
  };
};
