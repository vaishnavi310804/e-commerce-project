import ecommerceClient from "./ecommerceClient";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: {
    public_id: string;
    url: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const getCategories = async () => {
  const { data } = await ecommerceClient.get<ApiResponse<Category[]>>(
    "/category"
  );

  return data;
};