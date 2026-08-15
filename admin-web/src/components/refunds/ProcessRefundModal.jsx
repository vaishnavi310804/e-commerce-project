import React from "react";
import { FaTimes, FaUndoAlt, FaRupeeSign } from "react-icons/fa";

const ProcessRefundModal = ({
  open,
  refund,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!open || !refund) return null;

  const customerName =
    refund.user?.fullName ||
    refund.user?.name ||
    refund.shippingAddress?.fullName ||
    "Guest Customer";

  const refundAmount = Number(refund.refundAmount || refund.totalAmount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-[#6547C9]">
              <FaUndoAlt size={18} />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Process Refund
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="text-sm text-gray-500">
              Are you sure you want to process the refund for this order?
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Order ID</p>

                <p className="mt-1 font-semibold text-gray-800">
                  {refund.orderNumber || "—"}
                </p>
              </div>

              <FaUndoAlt className="text-gray-400" />
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-400">Customer</p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {customerName}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
            <p className="text-xs font-medium text-[#6547C9]">
              Refund Amount
            </p>

            <div className="mt-1 flex items-center gap-1">
              <FaRupeeSign className="text-[#6547C9]" />

              <span className="text-2xl font-bold text-[#6547C9]">
                {refundAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            The refund will be processed through Razorpay. This action
            cannot be manually reversed after the refund has been initiated.
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-[#6547C9] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6547C9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Process Refund"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessRefundModal;