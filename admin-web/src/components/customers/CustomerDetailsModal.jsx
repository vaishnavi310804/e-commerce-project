import React, { useEffect, useState } from "react";
import { FaTimes, FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";
import { getCustomerById } from "../../services/customerApi";
import StatusBadge from "../orders/StatusBadge";

const CustomerDetailsModal = ({ open, onClose, customerId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!customerId) return;
      try {
        setLoading(true);
        const res = await getCustomerById(customerId);
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (open && customerId) {
      fetchDetails();
    }
  }, [open, customerId]);

  if (!open || !customerId) return null;

  const { customer, addresses = [], stats = {}, recentOrders = [] } = data || {};
  const primaryAddress = addresses[0] || {};

  const street =
    primaryAddress.addressLine1 ||
    primaryAddress.streetAddress ||
    primaryAddress.street ||
    "";
  const street2 = primaryAddress.addressLine2 || "";
  const hasAddress = Boolean(street || primaryAddress.city || primaryAddress.state);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Customer Profile & History
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-12 text-gray-500">
            Loading customer details...
          </div>
        ) : !customer ? (
          <div className="p-6 text-center text-gray-500">
            Failed to load customer information.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {customer.profileImage ? (
                  <img
                    src={customer.profileImage}
                    alt={customer.fullName}
                    className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
                    {customer.fullName?.charAt(0).toUpperCase() || "C"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {customer.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  <p className="text-xs text-gray-500">
                    Phone: {customer.phoneNumber || primaryAddress.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    customer.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {customer.isActive ? "Active Account" : "Blocked Account"}
                </span>
                <span className="text-xs text-gray-500">
                  Joined {new Date(customer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                <p className="text-xs font-semibold text-gray-500">Total Orders</p>
                <p className="text-lg font-bold text-gray-800">
                  {stats.totalOrders || 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                <p className="text-xs font-semibold text-emerald-600">Completed</p>
                <p className="text-lg font-bold text-emerald-700">
                  {stats.completedOrders || 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                <p className="text-xs font-semibold text-amber-600">Pending</p>
                <p className="text-lg font-bold text-amber-700">
                  {stats.pendingOrders || 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                <p className="text-xs font-semibold text-rose-600">Cancelled</p>
                <p className="text-lg font-bold text-rose-700">
                  {stats.cancelledOrders || 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-purple-600">Total Spent</p>
                <p className="text-lg font-bold text-purple-700">
                  ${Number(stats.totalSpending || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-indigo-600" />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                  Primary Address {primaryAddress.addressType ? `(${primaryAddress.addressType})` : ""}
                </h4>
              </div>
              {hasAddress ? (
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p className="font-medium text-gray-800">
                    {primaryAddress.fullName || customer.fullName}
                  </p>
                  <p>{street}</p>
                  {street2 && <p>{street2}</p>}
                  <p>
                    {[primaryAddress.city, primaryAddress.state, primaryAddress.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{primaryAddress.country || "India"}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address saved on profile.</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <FaShoppingBag className="text-indigo-600" />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                  Latest Orders
                </h4>
              </div>

              {recentOrders.length === 0 ? (
                <div className="rounded-xl border border-gray-200 p-4 text-center text-sm text-gray-500">
                  No orders placed yet.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <tr>
                        <th className="px-4 py-2.5">Order ID</th>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Amount</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-800">
                            {ord.orderNumber || ord._id.substring(18)}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-gray-900">
                            ${Number(ord.totalAmount || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-2.5">
                            <StatusBadge type="order" status={ord.orderStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
