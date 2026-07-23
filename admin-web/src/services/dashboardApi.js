import ecommerceApi from "./ecommerceApi";

export const getDashboardStats = async (params = {}) => {
  const response = await ecommerceApi.get("/dashboard/stats", { params });
  return response.data;
};

export const getDashboardRevenue = async (params = {}) => {
  const response = await ecommerceApi.get("/dashboard/revenue", { params });
  return response.data;
};

export const getDashboardOrders = async (params = {}) => {
  const response = await ecommerceApi.get("/dashboard/orders", { params });
  return response.data;
};

export const getDashboardSales = async (params = {}) => {
  const response = await ecommerceApi.get("/dashboard/sales", { params });
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await ecommerceApi.get("/dashboard/recent-orders");
  return response.data;
};

export const getTopProducts = async () => {
  const response = await ecommerceApi.get("/dashboard/top-products");
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await ecommerceApi.get("/dashboard/low-stock");
  return response.data;
};

export const getRecentReviews = async () => {
  const response = await ecommerceApi.get("/dashboard/recent-reviews");
  return response.data;
};

export const getCustomerGrowth = async () => {
  const response = await ecommerceApi.get("/dashboard/customer-growth");
  return response.data;
};
