import React from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

const OrderTable = ({
  orders,
  loading,
  onViewOrder,
  onUpdateStatus,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-[1100px] w-full border-collapse">
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
              Total Amount
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Payment Method
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Payment Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Order Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Created Date
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => {
            const customerName =
              order.user?.fullName ||
              order.user?.name ||
              order.shippingAddress?.fullName ||
              "Guest Customer";
            const itemCount =
              order.products?.length || order.items?.length || 0;

            return (
              <tr
                key={order._id}
                className="transition hover:bg-gray-50/80"
              >
                {/* Order ID */}
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                  {order.orderNumber || order._id.substring(18)}
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <div className="font-medium text-gray-900">{customerName}</div>
                  <div className="text-xs text-gray-500">{order.user?.email || ""}</div>
                </td>

                {/* Items count */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </td>

                {/* Total amount */}
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </td>

                {/* Payment method */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">
                    {order.paymentMethod || "COD"}
                  </span>
                </td>

                {/* Payment status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge type="payment" status={order.paymentStatus} />
                </td>

                {/* Order status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge type="order" status={order.orderStatus} />
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                      title="View Details"
                    >
                      <FaEye size={17} />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(order)}
                      className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 hover:text-purple-700"
                      title="Update Status"
                    >
                      <FaEdit size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
