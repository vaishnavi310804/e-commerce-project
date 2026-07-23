import {
  getDashboardStatsService,
  getDashboardRevenueService,
  getDashboardOrdersService,
  getDashboardSalesService,
  getRecentOrdersService,
  getTopProductsService,
  getLowStockProductsService,
  getRecentReviewsService,
  getCustomerGrowthService,
} from "./dashboard.service.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService(req.query);
    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully.",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardRevenue = async (req, res, next) => {
  try {
    const revenueData = await getDashboardRevenueService(req.query);
    return res.status(200).json({
      success: true,
      message: "Revenue analytics fetched successfully.",
      data: revenueData,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardOrders = async (req, res, next) => {
  try {
    const ordersData = await getDashboardOrdersService(req.query);
    return res.status(200).json({
      success: true,
      message: "Orders analytics fetched successfully.",
      data: ordersData,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardSales = async (req, res, next) => {
  try {
    const salesData = await getDashboardSalesService(req.query);
    return res.status(200).json({
      success: true,
      message: "Sales breakdown fetched successfully.",
      data: salesData,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await getRecentOrdersService();
    return res.status(200).json({
      success: true,
      message: "Recent orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const products = await getTopProductsService();
    return res.status(200).json({
      success: true,
      message: "Top selling products fetched successfully.",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const products = await getLowStockProductsService();
    return res.status(200).json({
      success: true,
      message: "Low stock products fetched successfully.",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentReviews = async (req, res, next) => {
  try {
    const reviews = await getRecentReviewsService();
    return res.status(200).json({
      success: true,
      message: "Recent reviews fetched successfully.",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerGrowth = async (req, res, next) => {
  try {
    const growthData = await getCustomerGrowthService();
    return res.status(200).json({
      success: true,
      message: "Customer growth analytics fetched successfully.",
      data: growthData,
    });
  } catch (error) {
    next(error);
  }
};
