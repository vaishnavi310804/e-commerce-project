import ecommerceClient from "./ecommerceClient";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  price: number;
  discountPrice: number;
  averageRating: number;
  numReviews: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  productImage: {
    url: string;
    public_id: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const getProducts = async () => {
  const { data } =
    await ecommerceClient.get<ApiResponse<Product[]>>(
      "/product"
    );

  return data;
};

export const getProductById = async (id: string) => {
  const { data } = await ecommerceClient.get<ApiResponse<Product>>(
    `/product/${id}`
  );

  return data;
};