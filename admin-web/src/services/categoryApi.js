import ecommerceApi from "./ecommerceApi";

export const getAllCategories = async () => {
  const response = await ecommerceApi.get("/category");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await ecommerceApi.post("/category/create", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await ecommerceApi.put(`/category/update/${id}`, data);
  return response.data;
};

export const updateCategoryStatus = async (id) => {
  const response = await ecommerceApi.patch(`/category/status/${id}`);
  return response.data;
};