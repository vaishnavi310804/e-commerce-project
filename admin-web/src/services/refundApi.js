import ecommerceClient from "./ecommerceApi";

export const getRefundOrders = async (params = {}) => {
  const { data } = await ecommerceClient.get("/order/refunds", {
    params,
  });

  return data;
};

export const processRefund = async (orderId) => {
  const { data } = await ecommerceClient.post(
    `/order/${orderId}/refund`
  );

  return data;
};