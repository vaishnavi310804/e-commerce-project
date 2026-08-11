import React from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

const OrderTable = ({ orders, loading, onViewOrder, onUpdateStatus }) => {
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
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
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
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {order.orderNumber || order._id?.substring(18)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="font-medium text-gray-900">
                        {customerName}
                      </div>

                      <div className="text-xs text-gray-500">
                        {order.user?.email || ""}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">
                        {order.paymentMethod || "COD"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        type="payment"
                        status={order.paymentStatus}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge type="order" status={order.orderStatus} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <OrderActions
                        order={order}
                        onViewOrder={onViewOrder}
                        onUpdateStatus={onUpdateStatus}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {orders.map((order) => {
          const customerName =
            order.user?.fullName ||
            order.user?.name ||
            order.shippingAddress?.fullName ||
            "Guest Customer";

          const itemCount = order.products?.length || order.items?.length || 0;

          return (
            <div key={order._id} className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">Order ID</p>

                  <h3 className="mt-1 truncate text-sm font-bold text-gray-900">
                    {order.orderNumber || order._id?.substring(18)}
                  </h3>
                </div>

                <OrderActions
                  order={order}
                  onViewOrder={onViewOrder}
                  onUpdateStatus={onUpdateStatus}
                />
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">Customer</p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {customerName}
                </p>

                {order.user?.email && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {order.user.email}
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Items</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Total Amount</p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Payment</p>

                    <span className="mt-1 inline-block rounded-lg bg-indigo-300 px-2 py-1 text-xs font-medium text-white shadow-sm">
                      {order.paymentMethod || "COD"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Created</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-gray-100 pt-3">
                <div>
                  <p className="mb-1 text-xs text-gray-400">Payment Status</p>

                  <StatusBadge type="payment" status={order.paymentStatus} />
                </div>

                <div>
                  <p className="mb-1 text-xs text-gray-400">Order Status</p>

                  <StatusBadge type="order" status={order.orderStatus} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const OrderActions = ({ order, onViewOrder, onUpdateStatus }) => {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onViewOrder(order)}
        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
        title="View Details"
      >
        <FaEye size={16} />
      </button>

      <button
        type="button"
        onClick={() => onUpdateStatus(order)}
        className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 hover:text-purple-700"
        title="Update Status"
      >
        <FaEdit size={16} />
      </button>
    </div>
  );
};

export default OrderTable;
