import React from "react";
import { FaTimes, FaUndoAlt } from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";

const RefundDetailsModal = ({ open, refund, onClose }) => {
  if (!open || !refund) return null;

  const customerName =
    refund.user?.fullName ||
    refund.user?.name ||
    refund.shippingAddress?.fullName ||
    "Guest Customer";

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaUndoAlt size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                Refund Details
              </h2>

              <p className="text-xs text-gray-500">
                {refund.orderNumber || "Order"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            title="Close"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">

          <div className="mb-5 flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Refund Status
              </p>

              <div className="mt-1">
                <StatusBadge
                  type="refund"
                  status={refund.refundStatus}
                />
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-medium text-gray-400">
                Refund Amount
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatAmount(refund.refundAmount)}
              </p>
            </div>
          </div>

          <section className="mb-5">
            <div className="mb-3 flex items-center gap-2">

              <h3 className="font-semibold text-gray-800">
                Customer Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Customer Name</p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {customerName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>

                <p className="mt-1 break-all text-sm text-gray-700">
                  {refund.user?.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Phone</p>

                <p className="mt-1 text-sm text-gray-700">
                  {refund.user?.phoneNumber ||
                    refund.shippingAddress?.phoneNumber ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Order ID</p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {refund.orderNumber || "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-5">
            <div className="mb-3 flex items-center gap-2">

              <h3 className="font-semibold text-gray-800">
                Payment Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">
                  Payment Method
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {refund.paymentMethod || "COD"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Payment Status
                </p>

                <div className="mt-1">
                  <StatusBadge
                    type="payment"
                    status={refund.paymentStatus}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Original Amount
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {formatAmount(refund.totalAmount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Refund Amount
                </p>

                <p className="mt-1 text-sm font-bold text-indigo-600">
                  {formatAmount(refund.refundAmount)}
                </p>
              </div>

              {refund.bankDetails?.upiId && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">Customer UPI ID</p>
                  <p className="mt-1 text-sm font-bold text-gray-900 select-all">
                    {refund.bankDetails.upiId}
                  </p>
                </div>
              )}

              {refund.bankDetails?.accountNumber && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">Customer Bank Account</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {refund.bankDetails.accountHolderName ? `${refund.bankDetails.accountHolderName} • ` : ""}
                    {refund.bankDetails.accountNumber}
                    {refund.bankDetails.ifscCode ? ` (${refund.bankDetails.ifscCode.toUpperCase()})` : ""}
                    {refund.bankDetails.bankName ? ` - ${refund.bankDetails.bankName}` : ""}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-gray-800">
              Refund Information
            </h3>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">
                    Refund Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge
                      type="refund"
                      status={refund.refundStatus}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Refund Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatDate(refund.refundDate)}
                  </p>
                </div>

                {refund.refundReason && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400">
                      Refund Reason
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {refund.refundReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundDetailsModal;