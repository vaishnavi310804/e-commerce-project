import ecommerceClient from "./ecommerceClient";

export interface ReviewPayload {
  rating: number;
  comment: string;
}
export interface ReviewUser {
  _id: string;
  fullName: string;
  profileImage: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

export interface ProductReviewsResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  reviews: Review[];
}

export const getProductReviews = async (productId: string) => {
  const response = await ecommerceClient.get(`/reviews/product/${productId}`);
  return response.data;
};

export const createReview = async (
  productId: string,
  payload: ReviewPayload
) => {
  const response = await ecommerceClient.post(
    `/reviews/product/${productId}`,
    payload
  );

  return response.data;
};

export const updateReview = async (
  productId: string,
  payload: ReviewPayload
) => {
  const response = await ecommerceClient.put(
    `/reviews/product/${productId}`,
    payload
  );

  return response.data;
};

export const deleteReview = async (productId: string) => {
  const response = await ecommerceClient.delete(
    `/reviews/product/${productId}`
  );

  return response.data;
};