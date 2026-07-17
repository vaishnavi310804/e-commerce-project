import {
  addToWishlistService, getWishlistService, removeFromWishlistService,toggleWishlistService
} from "./wishlist.service.js";
export const addToWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await addToWishlistService(
      req.user._id,
      req.params.productId,
    );
    res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully.",
      data: wishlistItem,
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getWishlistService(req.user._id);
    res.status(200).json({
      success: true,
      count: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const removeItem = await removeFromWishlistService(
      req.user._id,
      req.params.productId,
    );
    res.status(200).json({
      success: true,
      message: removeItem.message,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const result = await toggleWishlistService(
      req.user._id,
      req.params.productId
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};