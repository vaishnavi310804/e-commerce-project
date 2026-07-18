import { addToCartService, getCartService, updateCartService, removeFromCartService, clearCartService } from "./cart.service.js";

export const addToCart = async (req, res, next) => {
  try {
    const cart = await addToCartService(
      req.user._id,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const result = await getCartService(req.user._id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const cart = await updateCartService(
      req.user._id,
      req.params.productId,
      Number(req.body.quantity)
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const result = await removeFromCartService(
      req.user._id,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const result = await clearCartService(req.user._id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};