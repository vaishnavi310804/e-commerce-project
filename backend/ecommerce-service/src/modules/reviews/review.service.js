import Review from "./review.model.js";
import Product from "../products/product.model.js";
import mongoose from "mongoose";

const updateProductRating = async (productId) => {
  const productObjectId = new mongoose.Types.ObjectId(productId);
  const stats = await Review.aggregate([
    {
      $match: {
        product: productObjectId,
        isHidden: false,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0,
    });

    return;
  }

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(stats[0].averageRating.toFixed(1)),
    numReviews: stats[0].numReviews,
  });
};

export const getAllReviewsService = async (query = {}) => {
  const { search, rating, status, sort } = query;
  const filter = {};

  if (rating && rating !== "all") {
    filter.rating = Number(rating);
  }

  if (status === "visible") {
    filter.isHidden = false;
  } else if (status === "hidden") {
    filter.isHidden = true;
  }

  let reviews = await Review.find(filter)
    .populate("user", "fullName email profileImage name")
    .populate("product", "name productImage image brand price")
    .sort({ createdAt: -1 });

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    reviews = reviews.filter((r) => {
      const prodName = r.product?.name || "";
      const custName = r.user?.fullName || r.user?.name || "";
      const text = r.comment || r.review || "";
      return (
        prodName.toLowerCase().includes(s) ||
        custName.toLowerCase().includes(s) ||
        text.toLowerCase().includes(s)
      );
    });
  }

  if (sort === "oldest") {
    reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === "highest_rating") {
    reviews.sort((a, b) => b.rating - a.rating);
  } else if (sort === "lowest_rating") {
    reviews.sort((a, b) => a.rating - b.rating);
  }

  return reviews;
};

export const getReviewByIdService = async (reviewId) => {
  const review = await Review.findById(reviewId)
    .populate("user", "fullName email profileImage name phoneNumber")
    .populate("product", "name productImage image brand price category");

  if (!review) {
    throw new Error("Review not found.");
  }

  return review;
};

export const toggleHideReviewService = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found.");
  }

  review.isHidden = !review.isHidden;
  await review.save();
  await updateProductRating(review.product);

  return review;
};

export const deleteReviewService = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    throw new Error("Review not found.");
  }
  await updateProductRating(review.product); 
  return review;
};

export const bulkHideReviewsService = async (ids, isHidden) => {
  await Review.updateMany({ _id: { $in: ids } }, { isHidden });
  return true;
};

export const bulkDeleteReviewsService = async (ids) => {
  await Review.deleteMany({ _id: { $in: ids } });
  return true;
};

export const getReviewStatsService = async () => {
  const reviews = await Review.find();

  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter((r) => !r.isHidden).length;
  const hiddenReviews = reviews.filter((r) => r.isHidden).length;

  const totalRatingSum = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating =
    totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : "0.0";

  const fiveStarReviews = reviews.filter((r) => r.rating === 5).length;
  const oneStarReviews = reviews.filter((r) => r.rating === 1).length;

  return {
    totalReviews,
    visibleReviews,
    hiddenReviews,
    averageRating,
    fiveStarReviews,
    oneStarReviews,
  };
};

export const getProductReviewsService = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    isHidden: false,
  })
    .populate("user", "fullName profileImage")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;

  let averageRating = 0;

  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    averageRating += review.rating;
    ratingDistribution[review.rating]++;
  });

  averageRating =
    totalReviews > 0 ? Number((averageRating / totalReviews).toFixed(1)) : 0;

  return {
    averageRating,
    totalReviews,
    ratingDistribution,
    reviews,
  };
};

export const createReviewService = async ({
  userId,
  productId,
  rating,
  comment,
}) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product.");
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  await updateProductRating(productId);

  return review;
};

export const updateReviewService = async ({
  userId,
  productId,
  rating,
  comment,
}) => {
  const review = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  review.rating = rating;
  review.comment = comment;

  await review.save();

  await updateProductRating(productId);

  return review;
};

export const deleteMyReviewService = async (userId, productId) => {
  const review = await Review.findOneAndDelete({
    user: userId,
    product: productId,
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  await updateProductRating(productId);
};
