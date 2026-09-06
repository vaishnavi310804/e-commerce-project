import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getSessions, forceLogoutSession } from "../../services/sessionApi";
import SessionTable from "../../components/sessions/SessionTable";
import ConfirmationModel from "../../components/common/ConfirmationModel";
import SearchBar from "../../components/common/SearchBar";
import {
  FaLaptop,
  FaUserCheck,
  FaUserSlash,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
        search: searchTerm,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      };

      const response = await getSessions(params);

      setSessions(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error("Fetch sessions error:", err);
      setError(err.response?.data?.message || "Failed to load active sessions.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  const handleOpenForceLogoutModal = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleConfirmForceLogout = async () => {
    if (!selectedSession) return;

    try {
      setRevoking(true);
      setError("");

      await forceLogoutSession(selectedSession._id);

      showToast(`Force logged out session for ${selectedSession.userId?.fullName || "user"}.`);
      setIsModalOpen(false);
      setSelectedSession(null);

      // Refresh table
      await fetchSessions();
    } catch (err) {
      console.error("Force logout error:", err);
      setError(err.response?.data?.message || "Failed to force logout session.");
      setIsModalOpen(false);
    } finally {
      setRevoking(false);
    }
  };

  const activeCount = sessions.filter(
    (s) => !s.isRevoked && (!s.expiresAt || new Date(s.expiresAt) > new Date())
  ).length;

  const revokedCount = sessions.filter((s) => s.isRevoked).length;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-2xl transition">
            {toastMessage}
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Session Management
            </h1>
            <p className="mt-1 text-gray-500">
              Monitor and manage user and administrator sessions across devices.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaLaptop size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Total Sessions</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {pagination.total || 0}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaUserCheck size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Active Sessions</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {activeCount}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-600">
              <FaUserSlash size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Revoked Sessions</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {revokedCount}
              </h3>
            </div>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by User Name or Email..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={roleFilter}
              onChange={handleRoleChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
              <option value="FULL_ADMIN">Full Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="REVOKED">Revoked</option>
            </select>

            {(searchTerm || roleFilter !== "ALL" || statusFilter !== "ALL") && (
              <button
                onClick={handleResetFilters}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Session Table */}
        <SessionTable
          sessions={sessions}
          loading={loading}
          onForceLogout={handleOpenForceLogoutModal}
        />

        {/* Pagination Container */}
        {!loading && sessions.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(page * limit, pagination.total || sessions.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {pagination.total || sessions.length}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>

              <span className="px-3 text-sm font-semibold text-gray-800">
                Page {page} of {pagination.pages || 1}
              </span>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages || 1))}
                disabled={page >= (pagination.pages || 1) || loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModel
          isOpen={isModalOpen}
          title="Force Logout?"
          message="Are you sure you want to force logout this user from this session? They will be required to log in again."
          confirmText={revoking ? "Revoking..." : "Force Logout"}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedSession(null);
          }}
          onConfirm={handleConfirmForceLogout}
        />
      </div>
    </DashboardLayout>
  );
};

export default SessionManagement;
