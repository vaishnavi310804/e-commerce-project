import React from "react";
import StatusBadge from "../orders/StatusBadge";
import { Link } from "react-router-dom";

const RecentOrdersTable = ({ orders = [] }) => {
  return (
    <div className="flex flex-col rounded-xl bg-white p-5 shadow">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-base font-semibold text-gray-800">Recent Orders</h3>
        <Link to="/orders" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {ord.orderNumber || ord._id.substring(18)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {ord.user?.fullName || ord.user?.name || "Guest Customer"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    ${Number(ord.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="payment" status={ord.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="order" status={ord.orderStatus} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
