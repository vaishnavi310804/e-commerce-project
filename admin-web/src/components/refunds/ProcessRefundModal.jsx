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

  const refundAmount = Number(
    refund.refundAmount || refund.totalAmount || 0
  );

  const isCodRefund =
    refund.bankDetails?.upiId ||
    refund.bankDetails?.accountNumber ||
    refund.originalOrder?.paymentMethod === "COD" ||
    refund.paymentMethod === "COD";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
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
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-6">

            <div>
              <p className="text-sm text-gray-500">
                Are you sure you want to process the refund for this order?
              </p>
            </div>

            {/* Order Information */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Order ID
                  </p>

                  <p className="mt-1 break-all font-semibold text-gray-800">
                    {refund.orderNumber || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">
                  Customer
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {customerName}
                </p>
              </div>
            </div>

            {/* Refund Information */}
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

              {/* UPI */}
              {refund.bankDetails?.upiId && (
                <div className="mt-4 border-t border-purple-200 pt-3">
                  <p className="text-xs font-medium text-gray-500">
                    Customer UPI ID
                  </p>

                  <p className="mt-1 select-all text-sm font-bold text-gray-900">
                    {refund.bankDetails.upiId}
                  </p>
                </div>
              )}

              {/* Bank Account */}
              {refund.bankDetails?.accountNumber && (
                <div className="mt-4 border-t border-purple-200 pt-3">
                  <p className="text-xs font-medium text-gray-500">
                    Customer Bank Account
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {refund.bankDetails.accountHolderName
                      ? `${refund.bankDetails.accountHolderName} • `
                      : ""}
                    {refund.bankDetails.accountNumber}

                    {refund.bankDetails.ifscCode
                      ? ` (${refund.bankDetails.ifscCode.toUpperCase()})`
                      : ""}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-700">
              {isCodRefund ? (
                <>
                  Please transfer the refund amount to the customer's
                  UPI/Bank destination above, then click{" "}
                  Process Refund to mark it as completed.
                </>
              ) : (
                <>
                  The refund will be processed through Razorpay. This action
                  cannot be manually reversed after the refund has been
                  initiated.
                </>
              )}
            </div>

          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-[#6547C9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5538B5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Process Refund"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProcessRefundModal;