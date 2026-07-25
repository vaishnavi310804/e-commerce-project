import ecommerceClient from "./ecommerceClient";
import { Product } from "./product.api";

export interface WishlistItem {
  _id: string;
  user: string;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export const toggleWishlist = async (productId: string) => {
  const { data } = await ecommerceClient.post<ApiResponse<any>>(
    `/wishlist/toggle/${productId}`
  );
  return data;
};

export const getWishlist = async () => {
  const { data } = await ecommerceClient.get<ApiResponse<WishlistItem[]>>(
    "/wishlist/get"
  );
  return data;
};