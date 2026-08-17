import React from "react";
import { FaEye, FaExchangeAlt, FaUndoAlt } from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";

const ReturnTable = ({
  returns,
  loading,
  onViewReturn,
  onUpdateStatus,
  onProcessRefund,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading returns...
      </div>
    );
  }

  if (!returns || returns.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No returns found.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString();
  };

  const getCustomerName = (returnItem) => {
    return (
      returnItem.user?.fullName ||
      returnItem.user?.name ||
      returnItem.order?.shippingAddress?.fullName ||
      "Guest Customer"
    );
  };

  const getOrderNumber = (returnItem) => {
    return returnItem.order?.orderNumber || "—";
  };

  const getItemCount = (returnItem) => {
    return (
      returnItem.items?.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      ) || 0
    );
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Order ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Items
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Reason
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Requested Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {returns.map((returnItem) => {
                const customerName = getCustomerName(returnItem);
                const orderNumber = getOrderNumber(returnItem);

                return (
                  <tr
                    key={returnItem._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-800">
                      {orderNumber}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      <div className="font-medium text-gray-900">
                        {customerName}
                      </div>

                      <div className="text-xs text-gray-500">
                        {returnItem.user?.email || ""}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">
                        {getItemCount(returnItem)}{" "}
                        {getItemCount(returnItem) === 1
                          ? "item"
                          : "items"}
                      </span>
                    </td>

                    <td className="max-w-[220px] px-6 py-4">
                      <p
                        className="truncate text-sm font-medium text-gray-800"
                        title={returnItem.reason || ""}
                      >
                        {returnItem.reason || "—"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {formatDate(returnItem.requestedAt)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge
                        type="return"
                        status={returnItem.status}
                      />
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <ReturnActions
                        returnItem={returnItem}
                        onViewReturn={onViewReturn}
                        onUpdateStatus={onUpdateStatus}
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
        {returns.map((returnItem) => {
          const customerName = getCustomerName(returnItem);
          const orderNumber = getOrderNumber(returnItem);
          const itemCount = getItemCount(returnItem);

          return (
            <div
              key={returnItem._id}
              className="rounded-xl bg-white p-4 shadow"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    Order ID
                  </p>

                  <h3 className="mt-0.5 truncate text-sm font-bold text-gray-900">
                    {orderNumber}
                  </h3>
                </div>

                <StatusBadge
                  type="return"
                  status={returnItem.status}
                />
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-400">Customer</p>

                <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                  {customerName}
                </p>

                {returnItem.user?.email && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {returnItem.user.email}
                  </p>
                )}
              </div>

              <div className="mt-3 rounded-lg bg-gray-50/50 p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Items
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {itemCount}{" "}
                      {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Requested
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(returnItem.requestedAt)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">
                      Reason
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-800">
                      {returnItem.reason || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                <ReturnActions
                  returnItem={returnItem}
                  onViewReturn={onViewReturn}
                  onUpdateStatus={onUpdateStatus}
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

const ReturnActions = ({
  returnItem,
  onViewReturn,
  onUpdateStatus,
  onProcessRefund,
}) => {
  const canUpdateStatus = ["Pending", "Approved", "Picked Up"].includes(
    returnItem.status,
  );

  const canProcessRefund =
    returnItem.status === "Approved";

  return (
    <div className="flex shrink-0 items-center gap-1">
      {onViewReturn && (
        <button
          type="button"
          onClick={() => onViewReturn(returnItem)}
          className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          title="View Return Details"
        >
          <FaEye size={16} />
        </button>
      )}

      {canUpdateStatus && onUpdateStatus && (
        <button
          type="button"
          onClick={() => onUpdateStatus(returnItem)}
          className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 hover:text-purple-700"
          title="Update Return Status"
        >
          <FaExchangeAlt size={16} />
        </button>
      )}

      {canProcessRefund && onProcessRefund && (
        <button
          type="button"
          onClick={() => onProcessRefund(returnItem)}
          className="rounded-lg p-2 text-[#6547C9] transition hover:bg-purple-50 hover:text-purple-700"
          title="Process Refund"
        >
          <FaUndoAlt size={16} />
        </button>
      )}
    </div>
  );
};

export default ReturnTable;