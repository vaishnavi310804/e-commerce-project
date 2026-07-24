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
  createdAt?: string;
  updatedAt?: string;
};

export type CreateAddressPayload = Omit<Address, "_id" | "createdAt" | "updatedAt">;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export const getDefaultAddress = async () => {
  const { data } = await client.get<ApiResponse<Address>>("/address/default");
  return data;
};

export const getAddresses = async () => {
  const response = await client.get<ApiResponse<Address[]>>("/address/get");
  return response.data;
};

export const addAddress = async (data: CreateAddressPayload) => {
  const response = await client.post<ApiResponse<Address>>("/address", data);
  return response.data;
};