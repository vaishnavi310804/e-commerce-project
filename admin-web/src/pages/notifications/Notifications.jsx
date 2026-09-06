import React, { useEffect, useState, useCallback } from "react";
import { FaPaperPlane, FaCheckCircle, FaPlus } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import NotificationHistoryTable from "../../components/notifications/NotificationHistoryTable";
import SendNotificationModal from "../../components/notifications/SendNotificationModal";
import { getNotificationHistory } from "../../services/notificationApi";

const ITEMS_PER_PAGE = 10;

const Notifications = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  const fetchHistory = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await getNotificationHistory({
        page,
        limit: ITEMS_PER_PAGE,
      });

      const historyData = response.data || response.history || [];
      setHistory(historyData);

      const pagination = response.pagination;
      if (pagination) {
        setTotalRecords(pagination.total || historyData.length);
        setTotalPages(pagination.totalPages || pagination.pages || 1);
      } else {
        setTotalRecords(historyData.length);
        setTotalPages(Math.ceil(historyData.length / ITEMS_PER_PAGE) || 1);
      }
    } catch (error) {
      console.error("Failed to fetch notification history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [fetchHistory, currentPage]);

  const handleSendSuccess = (successMsg) => {
    setShowSendModal(false);
    setSuccessBanner(successMsg || "Notification sent successfully.");
    setCurrentPage(1);
    fetchHistory(1);

    setTimeout(() => {
      setSuccessBanner("");
    }, 5000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Main Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track promotional notifications sent to customers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#6547C9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer shadow-sm"
          >
            <FaPaperPlane /> Send Notification
          </button>
        </div>

        {/* Success Alert Banner */}
        {successBanner && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 transition">
            <FaCheckCircle className="shrink-0 text-emerald-600" size={18} />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Notification History Table */}
        <NotificationHistoryTable history={history} loading={loading} />

        {/* Pagination Section */}
        {!loading && history.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {totalRecords}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>

              <span className="px-3 text-sm font-semibold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Send Notification Modal */}
        <SendNotificationModal
          open={showSendModal}
          onClose={() => setShowSendModal(false)}
          onSuccess={handleSendSuccess}
        />
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
