import React, { useEffect, useState, useCallback, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  FaUndoAlt,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaBan,
  FaRupeeSign,
  FaTruck,
  FaCog,
  FaPlus,
  FaOpencart,
  FaBoxOpen,
} from "react-icons/fa";
import ReturnTable from "../../components/returns/ReturnTable";
import ReturnDetailsModal from "../../components/returns/ReturnDetailsModal";
import UpdateReturnStatus from "../../components/returns/UpdateReturnStatus";
import {
  getAllReturns,
  getReturnDetails,
  updateReturnStatus,
  processReturnRefund,
} from "../../services/returnApi";

const ITEMS_PER_PAGE = 10;

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showReturnDetails, setShowReturnDetails] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);

  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllReturns();

      setReturns(response.data || []);
    } catch (error) {
      console.error("Failed to fetch returns:", error);
      setReturns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const totalReturns = returns.length;

  const pendingReturns = returns.filter(
    (returnItem) => returnItem.status === "Pending",
  ).length;

  const approvedReturns = returns.filter(
    (returnItem) => returnItem.status === "Approved",
  ).length;

  const rejectedReturns = returns.filter(
    (returnItem) => returnItem.status === "Rejected",
  ).length;

  const pickedUpReturns = returns.filter(
    (returnItem) => returnItem.status === "Picked Up",
  ).length;

  const completedReturns = returns.filter(
    (returnItem) => returnItem.status === "Completed",
  ).length;

  const filteredReturns = useMemo(() => {
    if (statusFilter === "All") {
      return returns;
    }

    return returns.filter(
      (returnItem) => returnItem.status === statusFilter,
    );
  }, [returns, statusFilter]);

  const totalPages =
    Math.ceil(filteredReturns.length / ITEMS_PER_PAGE) || 1;

  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleViewReturn = async (returnItem) => {
    try {
      const response = await getReturnDetails(returnItem._id);

      setSelectedReturn(response.data);
      setShowReturnDetails(true);
    } catch (error) {
      console.error("Failed to fetch return details:", error);
    }
  };

  const handleCloseReturnDetails = () => {
    setShowReturnDetails(false);
    setSelectedReturn(null);
  };

  const handleUpdateStatus = (returnItem) => {
    setSelectedReturn(returnItem);
    setShowUpdateStatus(true);
  };

  const handleCloseUpdateStatus = () => {
    setShowUpdateStatus(false);
    setSelectedReturn(null);
  };

  const handleStatusUpdate = async () => {
  setShowUpdateStatus(false);
  setSelectedReturn(null);

  await fetchReturns();
};

  const handleProcessRefund = async (returnItem) => {
  const confirmed = window.confirm(
    `Are you sure you want to process the refund for order ${
      returnItem.order?.orderNumber || "this order"
    }?`,
  );

  if (!confirmed) return;

  try {
    await processReturnRefund(returnItem._id);

    await fetchReturns();
  } catch (error) {
    console.error("Failed to process return refund:", error);

    alert(
      error.response?.data?.message ||
        "Failed to process return refund.",
    );
  }
};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Return Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all customer return requests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaUndoAlt size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Total Returns
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {totalReturns}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaClock size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Pending
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {pendingReturns}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
              <FaCheckCircle size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Approved
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {approvedReturns}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-600">
              <FaBan size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Rejected
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {rejectedReturns}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-purple-50 p-3 text-purple-600">
              <FaTruck size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Picked Up
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {pickedUpReturns}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaBox size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Completed
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {completedReturns}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-4 shadow">
          {[
            "All",
            "Pending",
            "Approved",
            "Rejected",
            "Picked Up",
            "Completed",
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <ReturnTable
          returns={paginatedReturns}
          loading={loading}
          onViewReturn={handleViewReturn}
          onUpdateStatus={handleUpdateStatus}
          onProcessRefund={handleProcessRefund}
        />

        {!loading && filteredReturns.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredReturns.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredReturns.length}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 text-sm font-semibold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages),
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <ReturnDetailsModal
          open={showReturnDetails}
          returnItem={selectedReturn}
          onClose={handleCloseReturnDetails}
        />

        <UpdateReturnStatus
          open={showUpdateStatus}
          returnItem={selectedReturn}
          onClose={handleCloseUpdateStatus}
          onSuccess={handleStatusUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default Returns;
