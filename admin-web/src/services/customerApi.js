import ecommerceApi from "./ecommerceApi";

export const getAllCustomers = async (params = {}) => {
  const response = await ecommerceApi.get("/customers", { params });
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await ecommerceApi.get(`/customers/${id}`);
  return response.data;
};

export const toggleCustomerStatus = async (id) => {
  const response = await ecommerceApi.patch(`/customers/status/${id}`);
  return response.data;
};

export const getCustomerStats = async () => {
  const response = await ecommerceApi.get("/customers/stats");
  return response.data;
};
