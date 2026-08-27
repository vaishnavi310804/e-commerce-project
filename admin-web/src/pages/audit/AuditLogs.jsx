import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import AuditLogTable from "../../components/audit/AuditLogTable";
import AuditLogDetailsModal from "../../components/audit/AuditLogDetailsModal";
import { useAuth } from "../../context/AuthContext";
import { getAuditLogs } from "../../services/auditApi";

const AuditLogs = () => {
  const { user: authUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 20 });

  const [selectedLog, setSelectedLog] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs({ page, limit: 20 });
      setLogs(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      alert("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filteredLogs = logs.filter((log) => {
    const actorName = log.actorId?.fullName || "";
    const actorEmail = log.actorId?.email || "";
    const targetName = log.targetId?.fullName || "";
    const description = log.description || "";

    const matchesSearch =
      actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              Admin Activity Audit Logs
            </h1>
            <p className="mt-1 text-gray-500">
              System activity for Admin User Management.
            </p>
          </div>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search logs..."
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
            onClick={() => setActionFilter("ADMIN_CREATED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "ADMIN_CREATED"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Created
          </button>

          <button
            onClick={() => setActionFilter("ADMIN_UPDATED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "ADMIN_UPDATED"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Updated
          </button>

          <button
            onClick={() => setActionFilter("ADMIN_ACTIVATED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "ADMIN_ACTIVATED"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Activated
          </button>

          <button
            onClick={() => setActionFilter("ADMIN_DEACTIVATED")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              actionFilter === "ADMIN_DEACTIVATED"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Deactivated
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

export default AuditLogs;
