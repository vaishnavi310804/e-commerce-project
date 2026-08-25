import React, { useEffect, useState, useCallback } from "react";
import {
  FaUndoAlt,
  FaClock,
  FaCheckCircle,
  FaBan,
  FaRupeeSign,
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import RefundTable from "../../components/refunds/RefundTable";
import RefundDetailsModal from "../../components/refunds/RefundDetailsModal";
import ProcessRefundModal from "../../components/refunds/ProcessRefundModal";
import { getRefundOrders, processRefund } from "../../services/refundApi";

const ITEMS_PER_PAGE = 10;
const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showRefundDetails, setShowRefundDetails] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processingRefund, setProcessingRefund] = useState(false);

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getRefundOrders();

      setRefunds(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch refunds:", error);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const totalRefunds = refunds.length;

  const pendingRefunds = refunds.filter(
    (refund) => refund.refundStatus === "Pending",
  ).length;

  const processedRefunds = refunds.filter(
    (refund) => refund.refundStatus === "Processed",
  ).length;

  const failedRefunds = refunds.filter(
    (refund) => refund.refundStatus === "Failed",
  ).length;

  const totalRefundAmount = refunds.reduce(
    (sum, refund) => sum + Number(refund.refundAmount || 0),
    0,
  );

  const handleViewRefund = (refund) => {
    setSelectedRefund(refund);
    setShowRefundDetails(true);
  };

  const handleCloseRefundDetails = () => {
    setShowRefundDetails(false);
    setSelectedRefund(null);
  };

  const handleProcessRefund = (refund) => {
    setSelectedRefund(refund);
    setShowProcessModal(true);
  };
  const handleConfirmRefund = async () => {
    if (!selectedRefund?._id) return;

    try {
      setProcessingRefund(true);

      await processRefund(selectedRefund._id);

      setShowProcessModal(false);
      setSelectedRefund(null);

      await fetchRefunds();
    } catch (error) {
      console.error("Failed to process refund:", error);

      alert(
        error.response?.data?.message ||
          "Failed to process refund. Please try again.",
      );
    } finally {
      setProcessingRefund(false);
    }
  };

  const handleCloseProcessModal = () => {
    if (processingRefund) return;

    setShowProcessModal(false);
    setSelectedRefund(null);
  };

  const totalPages = Math.ceil(refunds.length / ITEMS_PER_PAGE) || 1;

  const paginatedRefunds = refunds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Refund Dashboard
            </h1>
            <p className="mt-1 text-gray-500">Manage all the order refunds.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaUndoAlt size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Total Refunds
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {totalRefunds}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaClock size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Pending</p>

              <h3 className="text-2xl font-bold text-gray-800">
                {pendingRefunds}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaCheckCircle size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Processed</p>

              <h3 className="text-2xl font-bold text-gray-800">
                {processedRefunds}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-600">
              <FaBan size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Failed</p>

              <h3 className="text-2xl font-bold text-gray-800">
                {failedRefunds}
              </h3>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 rounded-xl bg-white p-5 shadow">
            <div className="shrink-0 rounded-xl bg-purple-50 p-3 text-purple-600">
              <FaRupeeSign size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                Refund Amount
              </p>

              <h3 className="truncate text-2xl font-bold text-gray-800">
                ₹{totalRefundAmount.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <RefundTable
          refunds={paginatedRefunds}
          loading={loading}
          onViewRefund={handleViewRefund}
          onProcessRefund={handleProcessRefund}
        />

        {!loading && refunds.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, refunds.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {refunds.length}
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

        <RefundDetailsModal
          open={showRefundDetails}
          refund={selectedRefund}
          onClose={handleCloseRefundDetails}
        />

        <ProcessRefundModal
          open={showProcessModal}
          refund={selectedRefund}
          loading={processingRefund}
          onClose={handleCloseProcessModal}
          onConfirm={handleConfirmRefund}
        />
      </div>
    </DashboardLayout>
  );
};

export default Refunds;
