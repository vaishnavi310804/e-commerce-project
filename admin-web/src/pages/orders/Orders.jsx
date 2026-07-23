import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaBan,
  FaDollarSign,
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import OrderFilters from "../../components/orders/OrderFilters";
import OrderTable from "../../components/orders/OrderTable";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import { getAllOrders } from "../../services/orderApi";

const ITEMS_PER_PAGE = 10;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatus, setOrderStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Pending" || o.orderStatus === "Placed"
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "Delivered"
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.orderStatus === "Cancelled"
  ).length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.user?.fullName ||
      order.user?.name ||
      order.shippingAddress?.fullName ||
      "";
    const orderIdStr = order.orderNumber || order._id || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderIdStr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrderStatus =
      orderStatus === "All" || order.orderStatus === orderStatus;

    const matchesPaymentStatus =
      paymentStatus === "All" || order.paymentStatus === paymentStatus;

    const matchesDate =
      !dateFilter ||
      new Date(order.createdAt).toISOString().split("T")[0] === dateFilter;

    return (
      matchesSearch &&
      matchesOrderStatus &&
      matchesPaymentStatus &&
      matchesDate
    );
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, orderStatus, paymentStatus, dateFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setOrderStatus("All");
    setPaymentStatus("All");
    setDateFilter("");
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            <p className="mt-1 text-gray-500">
              Manage and track customer orders
            </p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total Orders */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow border-l-4 border-indigo-500">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaShoppingBag size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow border-l-4 border-amber-500">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaClock size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Pending Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">{pendingOrders}</h3>
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow border-l-4 border-emerald-500">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaCheckCircle size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Delivered Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">{deliveredOrders}</h3>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow border-l-4 border-rose-500">
            <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
              <FaBan size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Cancelled Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">{cancelledOrders}</h3>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow border-l-4 border-purple-500">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <FaDollarSign size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">
                ${totalRevenue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <OrderFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          orderStatus={orderStatus}
          onOrderStatusChange={setOrderStatus}
          paymentStatus={paymentStatus}
          onPaymentStatusChange={setPaymentStatus}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onReset={handleResetFilters}
        />

        {/* Orders Table */}
        <OrderTable
          orders={paginatedOrders}
          loading={loading}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Pagination Footer */}
        {!loading && filteredOrders.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredOrders.length}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 text-sm font-semibold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Order Details & Status Update Modal */}
        <OrderDetailsModal
          open={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
          onSuccess={fetchOrdersData}
        />
      </div>
    </DashboardLayout>
  );
};

export default Orders;
