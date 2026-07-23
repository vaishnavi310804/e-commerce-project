import ecommerceApi from "./ecommerceApi";

export const getAllReviews = async (params = {}) => {
  const response = await ecommerceApi.get("/reviews", { params });
  return response.data;
};

export const getReviewById = async (id) => {
  const response = await ecommerceApi.get(`/reviews/${id}`);
  return response.data;
};

export const toggleHideReview = async (id) => {
  const response = await ecommerceApi.patch(`/reviews/hide/${id}`);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await ecommerceApi.delete(`/reviews/${id}`);
  return response.data;
};

export const bulkHideReviews = async (ids, isHidden) => {
  const response = await ecommerceApi.post("/reviews/bulk-hide", {
    ids,
    isHidden,
  });
  return response.data;
};

export const bulkDeleteReviews = async (ids) => {
  const response = await ecommerceApi.post("/reviews/bulk-delete", { ids });
  return response.data;
};

export const getReviewStats = async () => {
  const response = await ecommerceApi.get("/reviews/stats");
  return response.data;
};
