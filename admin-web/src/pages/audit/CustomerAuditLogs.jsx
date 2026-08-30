import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import AuditLogTable from "../../components/audit/AuditLogTable";
import AuditLogDetailsModal from "../../components/audit/AuditLogDetailsModal";
import { getAuditLogs } from "../../services/auditApi";

const CustomerAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 20 });

  const [selectedLog, setSelectedLog] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fetchCustomerAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs({ page, limit: 20, actorRole: "CUSTOMER" });
      setLogs(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch customer audit logs:", error);
      alert("Failed to load customer audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCustomerAuditLogs();
  }, [fetchCustomerAuditLogs]);

  const filteredLogs = logs.filter((log) => {
    const actorName = log.actorId?.fullName || "";
    const actorEmail = log.actorId?.email || "";
    const description = log.description || "";

    const matchesSearch =
      actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction =
      actionFilter === "all" ? true : log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedLog(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Customer Activity Audit Logs
            </h1>
            <p className="mt-1 text-gray-500">
              Audit log of key actions performed by customer accounts.
            </p>
          </div>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customer logs..."
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActionFilter("all")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "all"
                ? "bg-[#6547C9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Actions
          </button>

          <button
            onClick={() => setActionFilter("CUSTOMER_REGISTERED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "CUSTOMER_REGISTERED"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Registration
          </button>

          <button
            onClick={() => setActionFilter("CUSTOMER_LOGIN")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "CUSTOMER_LOGIN"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActionFilter("ORDER_CREATED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "ORDER_CREATED"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Orders
          </button>

          <button
            onClick={() => setActionFilter("ORDER_CANCELLED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "ORDER_CANCELLED"
                ? "bg-amber-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancellations
          </button>

          <button
            onClick={() => setActionFilter("RETURN_REQUESTED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "RETURN_REQUESTED"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Returns
          </button>

          <button
            onClick={() => setActionFilter("REVIEW_CREATED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "REVIEW_CREATED"
                ? "bg-pink-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Reviews
          </button>
        </div>

        <AuditLogTable
          logs={filteredLogs}
          loading={loading}
          onViewDetails={handleViewDetails}
        />

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500">
              Page <span className="font-semibold">{pagination.page}</span> of{" "}
              <span className="font-semibold">{pagination.pages}</span> ({pagination.total} total records)
            </div>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <AuditLogDetailsModal
          open={isOpenModal}
          onClose={handleCloseModal}
          log={selectedLog}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerAuditLogs;
