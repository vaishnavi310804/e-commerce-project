import Cart from './cart.model.js';
import Product from '../products/product.model.js';

export const addToCartService = async (userId, productId) => {

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found.");
  }
  if (!product.isActive) {
    throw new Error("Product is not available.");
  }
  if (product.stock < 1) {
    throw new Error("Product is out of stock.");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity: 1,
        },
      ],
    });
    return cart;
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      throw new Error("Cannot add more than available stock.");
    }
    existingItem.quantity += 1;
  } 
  else {
      cart.items.push({
      product: productId,
      quantity: 1,
    });
  }
  await cart.save();
  return cart;
}

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price discountPrice stock productImage isActive",
  });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }

  let totalItems = 0;
  let subtotal = 0;

  const items = cart.items.map((item) => {
    const product = item.product;

    if (!product) return null;

    const price = product.discountPrice || product.price;
    const itemTotal = price * item.quantity;

    totalItems += item.quantity;
    subtotal += itemTotal;

    return {
      product,
      quantity: item.quantity,
      itemTotal,
    };
  }).filter(Boolean);

  return {
    items,
    totalItems,
    subtotal,
  };
};

export const updateCartService = async (
  userId,
  productId,
  quantity
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    throw new Error("Product not found in cart.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  if (!product.isActive) {
    throw new Error("Product is not available.");
  }

  if (quantity > product.stock) {
    throw new Error("Requested quantity exceeds available stock.");
  }
  item.quantity = quantity;
  await cart.save();
  return cart;
};

export const removeFromCartService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error("Cart not found.");
  }
  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId
  );
  if (!itemExists) {
    throw new Error("Product not found in cart.");
  }
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();
  return {
    message: "Product removed from cart.",
  };
};


export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error("Cart not found.");
  }
  cart.items = [];
  await cart.save();
  return {
    message: "Cart cleared successfully.",
  };
};