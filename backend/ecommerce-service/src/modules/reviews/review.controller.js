import {
  getAllReviewsService,
  getReviewByIdService,
  toggleHideReviewService,
  deleteReviewService,
  bulkHideReviewsService,
  bulkDeleteReviewsService,
  getReviewStatsService,
} from "./review.service.js";

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await getAllReviewsService(req.query);
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const review = await getReviewByIdService(req.params.id);
    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleHideReview = async (req, res, next) => {
  try {
    const review = await toggleHideReviewService(req.params.id);
    return res.status(200).json({
      success: true,
      message: `Review ${review.isHidden ? "hidden" : "unhidden"} successfully.`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await deleteReviewService(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const bulkHideReviews = async (req, res, next) => {
  try {
    const { ids, isHidden } = req.body;
    await bulkHideReviewsService(ids, isHidden);
    return res.status(200).json({
      success: true,
      message: `Selected reviews ${isHidden ? "hidden" : "unhidden"} successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteReviews = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await bulkDeleteReviewsService(ids);
    return res.status(200).json({
      success: true,
      message: "Selected reviews deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewStats = async (req, res, next) => {
  try {
    const stats = await getReviewStatsService();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
