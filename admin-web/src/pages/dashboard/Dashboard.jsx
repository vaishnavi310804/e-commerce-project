import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardFilters from "../../components/dashboard/DashboardFilters";
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import OrdersChart from "../../components/dashboard/OrdersChart";
import CategoryChart from "../../components/dashboard/CategoryChart";
import PaymentChart from "../../components/dashboard/PaymentChart";
import CustomerGrowthChart from "../../components/dashboard/CustomerGrowthChart";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable";
import RecentReviewsTable from "../../components/dashboard/RecentReviewsTable";
import TopProductsTable from "../../components/dashboard/TopProductsTable";
import LowStockTable from "../../components/dashboard/LowStockTable";
import {
  FaDollarSign,
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaUserPlus,
  FaBoxOpen,
  FaExclamationTriangle,
  FaBan,
  FaStar,
  FaChartLine,
} from "react-icons/fa";
import {
  getDashboardStats,
  getDashboardRevenue,
  getDashboardOrders,
  getDashboardSales,
  getRecentOrders,
  getTopProducts,
  getLowStockProducts,
  getRecentReviews,
  getCustomerGrowth,
} from "../../services/dashboardApi";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [salesData, setSalesData] = useState({ categories: [], paymentMethods: [] });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [activeFilter, setActiveFilter] = useState("30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        range: activeFilter,
        startDate: activeFilter === "custom" ? startDate : undefined,
        endDate: activeFilter === "custom" ? endDate : undefined,
      };

      const [
        statsRes,
        revenueRes,
        ordersRes,
        salesRes,
        recentOrdersRes,
        topProductsRes,
        lowStockRes,
        reviewsRes,
        growthRes,
      ] = await Promise.all([
        getDashboardStats(params),
        getDashboardRevenue(params),
        getDashboardOrders(params),
        getDashboardSales(params),
        getRecentOrders(),
        getTopProducts(),
        getLowStockProducts(),
        getRecentReviews(),
        getCustomerGrowth(),
      ]);

      setStats(statsRes.data || {});
      setRevenueData(revenueRes.data || []);
      setOrdersData(ordersRes.data || []);
      setSalesData(salesRes.data || { categories: [], paymentMethods: [] });
      setRecentOrders(recentOrdersRes.data || []);
      setTopProducts(topProductsRes.data || []);
      setLowStock(lowStockRes.data || []);
      setRecentReviews(reviewsRes.data || []);
      setCustomerGrowth(growthRes.data || []);

      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, startDate, endDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Metric", "Value"],
        ["Total Revenue", `$${(stats.totalRevenue || 0).toFixed(2)}`],
        ["Monthly Revenue", `$${(stats.monthlyRevenue || 0).toFixed(2)}`],
        ["Total Orders", stats.totalOrders || 0],
        ["Completed Orders", stats.completedOrders || 0],
        ["Pending Orders", stats.pendingOrders || 0],
        ["Total Customers", stats.totalCustomers || 0],
        ["Total Products", stats.totalProducts || 0],
        ["Average Order Value", `$${(stats.avgOrderValue || 0).toFixed(2)}`],
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dashboard_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <DashboardHeader
          lastUpdated={lastUpdated}
          onRefresh={fetchDashboardData}
          loading={loading}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />

        <DashboardFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyCustom={fetchDashboardData}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Revenue"
            value={`$${Number(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            growth={stats.revenueGrowth}
            icon={FaDollarSign}
            color="indigo"
          />
          <StatCard
            title="Today's Revenue"
            value={`$${Number(stats.todayRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={FaChartLine}
            color="emerald"
            subText="Today"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${Number(stats.monthlyRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={FaDollarSign}
            color="purple"
            subText="This month"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            growth={stats.ordersGrowth}
            icon={FaShoppingBag}
            color="sky"
          />
          <StatCard
            title="Avg Order Value"
            value={`$${Number(stats.avgOrderValue || 0).toFixed(2)}`}
            icon={FaDollarSign}
            color="amber"
            subText="Per completed order"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders || 0}
            icon={FaClock}
            color="amber"
            subText="Awaiting fulfillment"
          />
          <StatCard
            title="Completed Orders"
            value={stats.completedOrders || 0}
            icon={FaCheckCircle}
            color="emerald"
            subText="Delivered"
          />
          <StatCard
            title="Cancelled Orders"
            value={stats.cancelledOrders || 0}
            icon={FaTimesCircle}
            color="rose"
            subText="Cancelled by user/admin"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers || 0}
            growth={stats.customerGrowth}
            icon={FaUsers}
            color="indigo"
          />
          <StatCard
            title="New Customers"
            value={stats.newCustomersThisMonth || 0}
            icon={FaUserPlus}
            color="purple"
            subText="This month"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Products"
            value={stats.totalProducts || 0}
            icon={FaBoxOpen}
            color="indigo"
          />
          <StatCard
            title="Active Products"
            value={stats.activeProducts || 0}
            icon={FaCheckCircle}
            color="emerald"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockProducts || 0}
            icon={FaExclamationTriangle}
            color="amber"
            subText="Stock <= 10"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStockProducts || 0}
            icon={FaBan}
            color="rose"
            subText="Stock <= 0"
          />
          <StatCard
            title="Avg Store Rating"
            value={`${stats.averageRating || "5.0"} ★`}
            icon={FaStar}
            color="amber"
            subText="Based on customer reviews"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart data={revenueData} />
          <OrdersChart data={revenueData} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <CategoryChart data={salesData.categories} />
          <PaymentChart data={salesData.paymentMethods} />
          <CustomerGrowthChart data={customerGrowth} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentOrdersTable orders={recentOrders} />
          <TopProductsTable products={topProducts} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LowStockTable products={lowStock} />
          <RecentReviewsTable reviews={recentReviews} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
