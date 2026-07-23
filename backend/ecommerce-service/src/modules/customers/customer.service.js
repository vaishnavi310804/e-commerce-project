import User from "../users/user.model.js";
import Order from "../orders/order.model.js";
import Address from "../address/address.model.js";

export const getAllCustomersService = async (query = {}) => {
  const { search, status, sort } = query;

  const matchStage = { role: "CUSTOMER" };

  if (status === "active") {
    matchStage.isActive = true;
  } else if (status === "blocked") {
    matchStage.isActive = false;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    matchStage.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { phoneNumber: searchRegex },
    ];
  }

  const customers = await User.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user",
        as: "orderHistory",
      },
    },
    {
      $project: {
        fullName: 1,
        email: 1,
        profileImage: 1,
        phoneNumber: 1,
        role: 1,
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
        totalOrders: { $size: "$orderHistory" },
        totalSpending: {
          $sum: {
            $map: {
              input: "$orderHistory",
              as: "ord",
              in: {
                $cond: [
                  { $ne: ["$$ord.orderStatus", "Cancelled"] },
                  { $ifNull: ["$$ord.totalAmount", 0] },
                  0,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  if (sort === "oldest") {
    customers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === "spending") {
    customers.sort((a, b) => b.totalSpending - a.totalSpending);
  } else if (sort === "orders") {
    customers.sort((a, b) => b.totalOrders - a.totalOrders);
  } else {
    customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return customers;
};

export const getCustomerByIdService = async (customerId) => {
  const customer = await User.findOne({ _id: customerId, role: "CUSTOMER" }).select(
    "-password -refreshToken"
  );

  if (!customer) {
    throw new Error("Customer not found.");
  }

  let addresses = await Address.find({ user: customerId });
  const orders = await Order.find({ user: customerId })
    .sort({ createdAt: -1 })
    .populate("address")
    .populate("products.product", "name productImage price");

  if (!addresses || addresses.length === 0) {
    const orderWithAddress = orders.find(
      (o) => o.address || o.shippingAddress
    );
    if (orderWithAddress) {
      const addr = orderWithAddress.address || orderWithAddress.shippingAddress;
      if (addr) {
        addresses = [
          typeof addr.toObject === "function" ? addr.toObject() : addr,
        ];
      }
    }
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "Cancelled").length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Pending" || o.orderStatus === "Placed"
  ).length;

  const totalSpending = orders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const recentOrders = orders.slice(0, 5);

  return {
    customer,
    addresses,
    stats: {
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      totalSpending,
    },
    recentOrders,
  };
};

export const toggleCustomerStatusService = async (customerId) => {
  const customer = await User.findOne({ _id: customerId, role: "CUSTOMER" });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  customer.isActive = !customer.isActive;
  await customer.save();

  return customer;
};

export const getCustomerStatsService = async () => {
  const customers = await User.find({ role: "CUSTOMER" });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.isActive).length;
  const blockedCustomers = customers.filter((c) => !c.isActive).length;
  const newCustomersThisMonth = customers.filter(
    (c) => new Date(c.createdAt) >= startOfMonth
  ).length;

  const allOrders = await Order.find();
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return {
    totalCustomers,
    activeCustomers,
    blockedCustomers,
    newCustomersThisMonth,
    totalOrders,
    totalRevenue,
  };
};
