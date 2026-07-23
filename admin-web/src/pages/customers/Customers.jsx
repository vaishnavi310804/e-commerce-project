import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CustomerStatsCards from "../../components/customers/CustomerStatsCards";
import CustomerFilters from "../../components/customers/CustomerFilters";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerDetailsModal from "../../components/customers/CustomerDetailsModal";
import BlockConfirmModal from "../../components/customers/BlockConfirmModal";
import {
  getAllCustomers,
  getCustomerStats,
  toggleCustomerStatus,
} from "../../services/customerApi";

const ITEMS_PER_PAGE = 10;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [selectedCustomerForBlock, setSelectedCustomerForBlock] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockingLoading, setBlockingLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [customersRes, statsRes] = await Promise.all([
        getAllCustomers({ search: searchTerm, status: statusFilter, sort: sortFilter }),
        getCustomerStats(),
      ]);
      setCustomers(customersRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [searchTerm, statusFilter, sortFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortFilter]);

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE) || 1;
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortFilter("newest");
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomerId(customer._id);
    setIsDetailsOpen(true);
  };

  const handleOpenBlockModal = (customer) => {
    setSelectedCustomerForBlock(customer);
    setIsBlockModalOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedCustomerForBlock) return;
    try {
      setBlockingLoading(true);
      const res = await toggleCustomerStatus(selectedCustomerForBlock._id);
      showToast(res.message || "Customer status updated successfully.");
      setIsBlockModalOpen(false);
      setSelectedCustomerForBlock(null);
      await fetchCustomerData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update customer status.");
    } finally {
      setBlockingLoading(false);
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    showToast(`Copied ${email} to clipboard!`);
  };

  const handleExportCSV = () => {
    if (!customers || customers.length === 0) {
      alert("No customer data available to export.");
      return;
    }

    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Total Orders",
      "Total Spending",
      "Status",
      "Joined Date",
    ];

    const rows = customers.map((c) => [
      c._id,
      `"${c.fullName || ""}"`,
      c.email,
      c.phoneNumber || "",
      c.totalOrders || 0,
      (c.totalSpending || 0).toFixed(2),
      c.isActive ? "Active" : "Blocked",
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Exported customers CSV successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-2xl transition">
            {toastMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
            <p className="mt-1 text-gray-500">
              Manage, monitor, and support store customers
            </p>
          </div>
        </div>

        <CustomerStatsCards stats={stats} />

        <CustomerFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortFilter={sortFilter}
          onSortChange={setSortFilter}
          onReset={handleResetFilters}
          onExportCSV={handleExportCSV}
        />

        <CustomerTable
          customers={paginatedCustomers}
          loading={loading}
          onViewCustomer={handleViewCustomer}
          onToggleStatus={handleOpenBlockModal}
          onCopyEmail={handleCopyEmail}
        />

        {!loading && customers.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, customers.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {customers.length}
              </span>{" "}
              customers
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

        <CustomerDetailsModal
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          customerId={selectedCustomerId}
        />

        <BlockConfirmModal
          open={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          customer={selectedCustomerForBlock}
          onConfirm={handleConfirmToggleStatus}
          loading={blockingLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Customers;
