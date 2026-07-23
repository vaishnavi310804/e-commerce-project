import ecommerceClient from "./ecommerceClient";
import { Product } from "./product.api";

export interface CartItem {
  product: Product;
  quantity: number;
  itemTotal: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const addToCart = async (productId: string) => {
  const { data } = await ecommerceClient.post<ApiResponse<CartData>>(
    `/cart/add/${productId}`
  );

  return data;
};

export const getCart = async () => {
  const { data } = await ecommerceClient.get<ApiResponse<CartData>>("/cart");

  return data;
};

export const updateCart = async (
  productId: string,
  quantity: number
) => {
  const { data } = await ecommerceClient.patch<ApiResponse<CartData>>(
    `/cart/update/${productId}`,
    {
      quantity,
    }
  );

  return data;
};

export const removeFromCart = async (productId: string) => {
  const { data } = await ecommerceClient.delete<ApiResponse<CartData>>(
    `/cart/remove/${productId}`
  );

  return data;
};

export const clearCart = async () => {
  const { data } = await ecommerceClient.delete<ApiResponse<CartData>>("/cart/clear");
  return data;
};