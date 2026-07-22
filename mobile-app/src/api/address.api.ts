import client from "./ecommerceClient";

export type Address = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: "Home" | "Office" | "Other";
  isDefault: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export const getDefaultAddress = async () => {
  const { data } = await client.get<ApiResponse<Address>>("/address/default");
  return data;
};