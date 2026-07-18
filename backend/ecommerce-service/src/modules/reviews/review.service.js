import Review from "./review.model.js";
import Product from "../products/product.model.js";
import Order from "../orders/order.routes.js";

export const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;
  const averageRating =
  numReviews === 0
    ? 0
    : Number(
        (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          numReviews
        ).toFixed(1)
      );

  await Product.findByIdAndUpdate(productId, {
    averageRating,
    numReviews,
  });
};

export const addReviewService = async (userId, productId, reviewData) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  if (!product.isActive) {
    throw new Error("Product is not available.");
  }

  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product.");
  }

  const hasPurchased = await Order.exists({
  user: userId,
  "items.product": productId,
  orderStatus: "Delivered",
});

if (!hasPurchased) {
  throw new Error(
    "You can only review products that you have purchased."
  );
}

  const review = await Review.create({
    user: userId,
    product: productId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  await review.populate("user", "name");
  await updateProductRating(productId);

  return review;
};

export const getProductReviewsService = async (productId) => {
  const product = await Product.findById(productId);

if (!product || !product.isActive) {
  throw new Error("Product not found.");
}

  const reviews = await Review.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return reviews;
};

export const updateReviewService = async (userId, reviewId, reviewData) => {
  const review = await Review.findOne({
    _id: reviewId,
    user: userId,
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  if (reviewData.rating !== undefined) {
    review.rating = reviewData.rating;
  }

  if (reviewData.comment !== undefined) {
    review.comment = reviewData.comment;
  }

  await review.save();

await updateProductRating(review.product);

await review.populate("user", "name");

return review;
};

export const deleteReviewService = async (userId, reviewId) => {
  const review = await Review.findOne({
    _id: reviewId,
    user: userId,
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  const productId = review.product;

  await review.deleteOne();
  await updateProductRating(productId);

  return true;
};
