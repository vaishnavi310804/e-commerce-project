import {
  addReviewService,
  getProductReviewsService,
  updateReviewService,
  deleteReviewService,
} from "./review.service.js";

export const addReview = async (req, res, next) => {
  try {
    const review = await addReviewService(
      req.user._id,
      req.params.productId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await getProductReviewsService(req.params.productId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await updateReviewService(
      req.user._id,
      req.params.reviewId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await deleteReviewService(req.user._id, req.params.reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
