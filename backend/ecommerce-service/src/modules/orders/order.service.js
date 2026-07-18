import Order from "./order.model.js";
import Address from "../address/address.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../products/product.model.js"


export const createOrderService = async (
  userId,
  addressId,
  paymentMethod
) => {
    const cart = await Cart.findOne({ user: userId }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

   const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found.");
  }
  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new Error("Product not found.");
    }

    if (!product.isActive) {
      throw new Error(`${product.name} not available.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Only ${product.stock} ${product.name} left in stock.`
      );
    }
    const price = product.discountPrice || product.price;

    totalAmount += price * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price,
    });
  }
  const order = await Order.create({
    user: userId,
    items: orderItems,
    address: addressId,
    totalAmount,
    paymentMethod,
  });
   for (const item of cart.items) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }
  cart.items = [];
  await cart.save();

  return order;
};

export const getMyOrdersService = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("address")
    .populate("items.product", "name productImage")
    .sort({ createdAt: -1 });

  return orders;
};

export const getOrderByIdService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate("address")
    .populate("items.product",
        "name productImage price discountPrice slug"
    );

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
};

export const cancelOrderService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).populate("items.product");

  if (!order) {
    throw new Error("Order not found.");
  }
  const cancelStatus =[
    "Placed",
    "Confirmed",
    "Packed",
  ];
  if(!cancelStatus.includes(order.orderStatus)){
    throw new Error(
      `Order cannot be cancelled as it is ${order.orderStatus}.`
    );
  }
  for (const item of order.items) {
    item.product.stock += item.quantity;
    await item.product.save();
  }

  order.orderStatus = "Cancelled";

   if (order.paymentMethod === "COD") {
    order.paymentStatus = "Pending";
  }
   await order.save();

  return order;
};