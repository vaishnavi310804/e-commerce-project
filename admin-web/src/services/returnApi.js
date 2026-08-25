import ecommerceApi from "./ecommerceApi";

export const getAllReturns = async (params = {}) => {
  const { data } = await ecommerceApi.get("/return", { params });
  return data;
};

export const getReturnDetails = async (returnId) => {
  const { data } = await ecommerceApi.get(`/return/${returnId}`);
  return data;
};

export const updateReturnStatus = async (returnId, status) => {
  const { data } = await ecommerceApi.patch(
    `/return/${returnId}/status`,
    { status },
  );

  return data;
};

export const processReturnRefund = async (returnId) => {
  const { data } = await ecommerceApi.patch(
    `/return/${returnId}/refund`,
  );

  return data;
};

export const checkReturnRefundStatus = async (returnId) => {
  const { data } = await ecommerceApi.patch(
    `/return/${returnId}/refund/status`,
  );

  return data;
};

export const processReturnReplacement = async (returnId) => {
  const { data } = await ecommerceApi.post(`/return/${returnId}/replacement`);
  return data;
};