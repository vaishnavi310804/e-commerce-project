import Order from "../orders/order.model.js";
import User from "../users/user.model.js";
import Product from "../products/product.model.js";
import Category from "../categories/category.model.js";
import Review from "../reviews/review.model.js";

const getDateRange = (range, startDate, endDate) => {
  const now = new Date();
  let start = new Date();
  let prevStart = new Date();
  let prevEnd = new Date();

  
  if (range === "today") {
    start.setHours(0, 0, 0, 0);
    prevStart.setDate(start.getDate() - 1);
    prevStart.setHours(0, 0, 0, 0);
    prevEnd.setDate(start.getDate() - 1);
    prevEnd.setHours(23, 59, 59, 999);
  } else if (range === "7days") {
    start.setDate(now.getDate() - 7);
    prevStart.setDate(now.getDate() - 14);
    prevEnd.setDate(now.getDate() - 7);
  } else if (range === "90days") {
    start.setDate(now.getDate() - 90);
    prevStart.setDate(now.getDate() - 180);
    prevEnd.setDate(now.getDate() - 90);
  } else if (range === "year") {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    prevStart.setFullYear(now.getFullYear() - 1, 0, 1);
    prevStart.setHours(0, 0, 0, 0);
    prevEnd.setFullYear(now.getFullYear() - 1, 11, 31);
    prevEnd.setHours(23, 59, 59, 999);
  } else if (range === "custom" && startDate && endDate) {
    start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    prevStart = new Date(start.getTime() - diff);
    prevEnd = new Date(start.getTime());
    return { start, end, prevStart, prevEnd };
  } else {
    start.setDate(now.getDate() - 30);
    prevStart.setDate(now.getDate() - 60);
    prevEnd.setDate(now.getDate() - 30);
  }

  return { start, end: now, prevStart, prevEnd };
};

export const getDashboardStatsService = async (query = {}) => {
  const { range = "30days", startDate, endDate } = query;
  const { start, end, prevStart, prevEnd } = getDateRange(range, startDate, endDate);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    allOrders,
    currentPeriodOrders,
    prevPeriodOrders,
    todayOrders,
    monthOrders,
    allCustomers,
    monthCustomers,
    prevMonthCustomers,
    allProducts,
    allReviews,
  ] = await Promise.all([
    Order.find(),
    Order.find({ createdAt: { $gte: start, $lte: end } }),
    Order.find({ createdAt: { $gte: prevStart, $lte: prevEnd } }),
    Order.find({ createdAt: { $gte: startOfToday } }),
    Order.find({ createdAt: { $gte: startOfMonth } }),
    User.find({ role: "CUSTOMER" }),
    User.find({ role: "CUSTOMER", createdAt: { $gte: startOfMonth } }),
    User.find({
      role: "CUSTOMER",
      createdAt: {
        $gte: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1),
        $lt: startOfMonth,
      },
    }),
    Product.find(),
    Review.find(),
  ]);

  const calculateRevenue = (orders) =>
    orders
      .filter((o) => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalRevenue = calculateRevenue(allOrders);
  const todayRevenue = calculateRevenue(todayOrders);
  const monthlyRevenue = calculateRevenue(monthOrders);
  const currentPeriodRevenue = calculateRevenue(currentPeriodOrders);
  const prevPeriodRevenue = calculateRevenue(prevPeriodOrders);

  const revenueGrowth =
    prevPeriodRevenue > 0
      ? Number((((currentPeriodRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100).toFixed(1))
      : 100;

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Placed").length;
  const completedOrders = allOrders.filter((o) => o.orderStatus === "Delivered").length;
  const cancelledOrders = allOrders.filter((o) => o.orderStatus === "Cancelled").length;

  const prevOrdersCount = prevPeriodOrders.length;
  const currentOrdersCount = currentPeriodOrders.length;
  const ordersGrowth =
    prevOrdersCount > 0
      ? Number((((currentOrdersCount - prevOrdersCount) / prevOrdersCount) * 100).toFixed(1))
      : 100;

  const totalCustomers = allCustomers.length;
  const newCustomersThisMonth = monthCustomers.length;
  const prevMonthCustomersCount = prevMonthCustomers.length;
  const customerGrowth =
    prevMonthCustomersCount > 0
      ? Number((((newCustomersThisMonth - prevMonthCustomersCount) / prevMonthCustomersCount) * 100).toFixed(1))
      : 100;

  const totalProducts = allProducts.length;
  const activeProducts = allProducts.filter((p) => p.isActive).length;
  const lowStockProducts = allProducts.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = allProducts.filter((p) => p.stock <= 0).length;

  const avgOrderValue =
    completedOrders > 0
      ? Number((totalRevenue / completedOrders).toFixed(2))
      : Number((totalRevenue / (totalOrders || 1)).toFixed(2));

  const totalRatingSum = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating =
    allReviews.length > 0
      ? Number((totalRatingSum / allReviews.length).toFixed(1))
      : 5.0;

  return {
    totalRevenue,
    todayRevenue,
    monthlyRevenue,
    revenueGrowth,
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    ordersGrowth,
    totalCustomers,
    newCustomersThisMonth,
    customerGrowth,
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    avgOrderValue,
    averageRating,
  };
};

export const getDashboardRevenueService = async (query = {}) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  const monthlyAgg = await Order.aggregate([
    {
      $match: {
        orderStatus: { $ne: "Cancelled" },
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(currentYear, 11, 31, 23, 59, 59),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
  ]);

  const monthlyData = months.map((name, idx) => {
    const monthNum = idx + 1;
    const found = monthlyAgg.find((m) => m._id === monthNum);
    return {
      month: name,
      revenue: found ? found.revenue : 0,
      orders: found ? found.orders : 0,
    };
  });

  return monthlyData;
};

export const getDashboardOrdersService = async (query = {}) => {
  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusMap = {
    Pending: 0,
    Placed: 0,
    Confirmed: 0,
    Processing: 0,
    Packed: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  statusCounts.forEach((sc) => {
    if (statusMap[sc._id] !== undefined) {
      statusMap[sc._id] = sc.count;
    }
  });

  const ordersByStatus = Object.keys(statusMap).map((key) => ({
    name: key,
    value: statusMap[key],
  }));

  return { ordersByStatus };
};

export const getDashboardSalesService = async (query = {}) => {
  const categoryAgg = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: {
        path: "$categoryDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        name: { $ifNull: ["$categoryDetails.name", "Uncategorized"] },
        value: "$count",
      },
    },
  ]);

  const paymentAgg = await Order.aggregate([
    {
      $group: {
        _id: "$paymentMethod",
        value: { $sum: 1 },
      },
    },
  ]);

  const paymentMethods = paymentAgg.map((p) => ({
    name: p._id || "COD",
    value: p.value,
  }));

  return {
    categories: categoryAgg,
    paymentMethods,
  };
};

export const getRecentOrdersService = async () => {
  return await Order.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .populate("user", "fullName email name");
};

export const getTopProductsService = async () => {
  const topAgg = await Order.aggregate([
    { $match: { orderStatus: { $ne: "Cancelled" } } },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        soldQuantity: { $sum: "$products.quantity" },
        revenue: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] },
        },
      },
    },
    { $sort: { soldQuantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        _id: 1,
        soldQuantity: 1,
        revenue: 1,
        name: "$productDetails.name",
        price: "$productDetails.price",
        productImage: "$productDetails.productImage",
        image: "$productDetails.image",
        rating: { $ifNull: ["$productDetails.rating", 5] },
      },
    },
  ]);

  return topAgg;
};

export const getLowStockProductsService = async () => {
  return await Product.find({ stock: { $lte: 10 } })
    .sort({ stock: 1 })
    .limit(6)
    .populate("category", "name");
};

export const getRecentReviewsService = async () => {
  return await Review.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "fullName email name profileImage")
    .populate("product", "name productImage image");
};

export const getCustomerGrowthService = async () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  const customerAgg = await User.aggregate([
    {
      $match: {
        role: "CUSTOMER",
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(currentYear, 11, 31, 23, 59, 59),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        customers: { $sum: 1 },
      },
    },
  ]);

  return months.map((name, idx) => {
    const monthNum = idx + 1;
    const found = customerAgg.find((c) => c._id === monthNum);
    return {
      month: name,
      customers: found ? found.customers : 0,
    };
  });
};
