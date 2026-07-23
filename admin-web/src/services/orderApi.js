import ecommerceApi from "./ecommerceApi";

export const getAllOrders = async (params = {}) => {
  const response = await ecommerceApi.get("/order", { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await ecommerceApi.get(`/order/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const response = await ecommerceApi.patch(`/order/status/${id}`, {
    orderStatus,
  });
  return response.data;
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  const response = await ecommerceApi.patch(`/order/payment-status/${id}`, {
    paymentStatus,
  });
  return response.data;
};

export const getOrderStats = async () => {
  const response = await ecommerceApi.get("/order/stats");
  return response.data;
};
