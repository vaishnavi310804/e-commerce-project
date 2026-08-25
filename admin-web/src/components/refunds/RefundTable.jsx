import React from "react";
import { FaEye, FaUndoAlt } from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";

const RefundTable = ({ refunds, loading, onViewRefund, onProcessRefund }) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading refunds...
      </div>
    );
  }

  if (!refunds || refunds.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No refunds found.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead className="bg-[#E0E0E0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Refund Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Refund Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Refund Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {refunds.map((refund) => {
                const customerName =
                  refund.user?.fullName ||
                  refund.user?.name ||
                  refund.shippingAddress?.fullName ||
                  "Guest Customer";

                const displayOrderId = refund.orderNumber || "—";

                return (
                  <tr
                    key={refund._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {displayOrderId}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="font-medium text-gray-900">
                        {customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {refund.user?.email || ""}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      ₹{Number(refund.refundAmount || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">
                        {refund.paymentMethod || "COD"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        type="payment"
                        status={refund.paymentStatus}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge type="refund" status={refund.refundStatus} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(refund.refundDate)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <RefundActions
                        refund={refund}
                        onViewRefund={onViewRefund}
                        onProcessRefund={onProcessRefund}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {refunds.map((refund) => {
          const customerName =
            refund.user?.fullName ||
            refund.user?.name ||
            refund.shippingAddress?.fullName ||
            "Guest Customer";

          const displayOrderId = refund.orderNumber || "—";

          return (
            <div key={refund._id} className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">Order ID</p>
                  <h3 className="mt-0.5 truncate text-sm font-bold text-gray-900">
                    {displayOrderId}
                  </h3>
                </div>
                <StatusBadge type="refund" status={refund.refundStatus} />
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-400">Customer</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                  {customerName}
                </p>
                {refund.user?.email && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {refund.user.email}
                  </p>
                )}
              </div>

              <div className="mt-3 rounded-lg bg-gray-50/50 p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Refund Amount</p>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      ₹{Number(refund.refundAmount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Payment Method</p>
                    <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {refund.paymentMethod || "COD"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Payment Status</p>
                    <div className="mt-1">
                      <StatusBadge
                        type="payment"
                        status={refund.paymentStatus}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Refund Date</p>
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(refund.refundDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                <RefundActions
                  refund={refund}
                  onViewRefund={onViewRefund}
                  onProcessRefund={onProcessRefund}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const RefundActions = ({ refund, onViewRefund, onProcessRefund }) => {
  const isProcessed = refund.refundStatus === "Processed";
  const isFailed = refund.refundStatus === "Failed";

  return (
    <div className="flex shrink-0 items-center gap-1">
      {onViewRefund && (
        <button
          type="button"
          onClick={() => onViewRefund(refund)}
          className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          title="View Refund Details"
        >
          <FaEye size={16} />
        </button>
      )}

      {!isProcessed && onProcessRefund && (
        <button
          type="button"
          onClick={() => onProcessRefund(refund)}
          className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 hover:text-purple-700"
          title={isFailed ? "Retry Refund" : "Process Refund"}
        >
          <FaUndoAlt size={16} />
        </button>
      )}
    </div>
  );
};

export default RefundTable;
