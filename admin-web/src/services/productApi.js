import ecommerceApi from "./ecommerceApi";

export const getAllProducts = async () => {
  const response = await ecommerceApi.get("/product/admin/getAll");
  return response.data;
};

export const createProduct = async (data) => {
  const response = await ecommerceApi.post("/product/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await ecommerceApi.put(`/product/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProductStatus = async (id) => {
  const response = await ecommerceApi.patch(`/product/status/${id}`);
  return response.data;
};