import React from "react";
import { FaEye, FaBan, FaCheck, FaCopy } from "react-icons/fa";

const CustomerTable = ({
  customers,
  loading,
  onViewCustomer,
  onToggleStatus,
  onCopyEmail,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading customers...
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No customers found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-[1100px] w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Profile
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Customer Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Phone
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Total Orders
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Total Spending
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Joined Date
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
          {customers.map((cust) => (
            <tr key={cust._id} className="transition hover:bg-gray-50/80">
              <td className="px-6 py-4 whitespace-nowrap">
                {cust.profileImage ? (
                  <img
                    src={cust.profileImage}
                    alt={cust.fullName}
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                    {cust.fullName?.charAt(0).toUpperCase() || "C"}
                  </div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {cust.fullName}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                <div className="flex items-center gap-2">
                  <span>{cust.email}</span>
                  <button
                    onClick={() => onCopyEmail(cust.email)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy email"
                  >
                    <FaCopy size={13} />
                  </button>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {cust.phoneNumber || "—"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                {cust.totalOrders || 0}
              </td>

              <td className="px-6 py-4 whitespace-nowrap font-semibold text-emerald-600">
                ${Number(cust.totalSpending || 0).toFixed(2)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(cust.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    cust.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {cust.isActive ? "Active" : "Blocked"}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onViewCustomer(cust)}
                    className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                    title="View Details"
                  >
                    <FaEye size={17} />
                  </button>

                  <button
                    onClick={() => onToggleStatus(cust)}
                    className={`rounded-lg p-2 transition ${
                      cust.isActive
                        ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                    title={cust.isActive ? "Block Customer" : "Unblock Customer"}
                  >
                    {cust.isActive ? <FaBan size={17} /> : <FaCheck size={17} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
