import Wishlist from "./wishlist.model.js";
import Product from "../products/product.model.js";

export const addToWishlistService = async (userId, productId) => {
    const product = await Product.findById(productId);


    if(!product){
        throw new Error("Product not found")
    }

    const existingWishlistItem = await Wishlist.findOne({
    user: userId,
    product: productId,
  });

  if (existingWishlistItem) {
    throw new Error("Product is already wishlisted.");
  }
  const wishlistItem = await Wishlist.create({
    user: userId,
    product: productId,
  });

  return wishlistItem;
};

export const getWishlistService = async (userId) => {
  const wishlist = await Wishlist.find({ user: userId })
    .populate({
      path: "product",
      select: "name slug price discountPrice productImage stock isActive",
    })
    .sort({ createdAt: -1 });

  return wishlist;

  //return wishlist.filter((item) => item.product && item.product.isActive);
};

export const removeFromWishlistService =async(userId, productId)=>{
    const wishlistItem = await Wishlist.findOneAndDelete({
    user: userId,
    product: productId,
  });

  if (!wishlistItem) {
    throw new Error("Product not in Wishlist");
}

  return{
    message:"Product removed from Wishlist"
  }
};

export const toggleWishlistService = async (userId, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  const existingWishlistItem = await Wishlist.findOne({
    user: userId,
    product: productId,
  });

  if (existingWishlistItem) {
    await Wishlist.findByIdAndDelete(existingWishlistItem._id);
    return {
      isWishlisted: false,
      message: "Product removed from wishlist.",
    };

  }
  await Wishlist.create({
    user: userId,
    product: productId,
  });

  return {
    isWishlisted: true,
    message: "Product added to wishlist.",
  };
};