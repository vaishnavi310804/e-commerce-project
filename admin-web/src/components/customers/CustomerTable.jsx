import React from "react";
import { FaEye, FaBan, FaCheck } from "react-icons/fa";

const CustomerTable = ({
  customers,
  loading,
  onViewCustomer,
  onToggleStatus,
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
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse">
            <thead className="bg-[#E0E0E0]">
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
                <tr
                  key={cust._id}
                  className="transition hover:bg-gray-50/80"
                >

                  <td className="px-6 py-4 whitespace-nowrap">
                    <CustomerAvatar customer={cust} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {cust.fullName || "—"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {cust.email || "—"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {cust.phoneNumber || "—"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {cust.totalOrders || 0}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-emerald-600">
                    ₹{Number(cust.totalSpending || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {cust.createdAt
                      ? new Date(
                          cust.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge customer={cust} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <CustomerActions
                      customer={cust}
                      onViewCustomer={onViewCustomer}
                      onToggleStatus={onToggleStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {customers.map((cust) => (
          <div
            key={cust._id}
            className="rounded-xl bg-white p-4 shadow"
          >
            <div className="flex items-start gap-3">
              <CustomerAvatar customer={cust} />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {cust.fullName || "Unknown Customer"}
                    </h3>

                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {cust.email || "No email"}
                    </p>
                  </div>

                  <CustomerActions
                    customer={cust}
                    onViewCustomer={onViewCustomer}
                    onToggleStatus={onToggleStatus}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-gray-700">
                    {cust.phoneNumber || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Total Orders
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {cust.totalOrders || 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Total Spending
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-600">
                    ₹
                    {Number(
                      cust.totalSpending || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Joined
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {cust.createdAt
                      ? new Date(
                          cust.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-gray-100 pt-3">
              <div>
                <p className="text-xs text-gray-400">
                  Account Status
                </p>
                <div className="mt-1">
                  <StatusBadge customer={cust} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleStatus(cust)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  cust.isActive
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {cust.isActive ? (
                  <>
                    <FaBan size={12} />
                    Block
                  </>
                ) : (
                  <>
                    <FaCheck size={12} />
                    Unblock
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const CustomerAvatar = ({ customer }) => {
  const profileImage =
    customer.profileImage?.url ||
    customer.profileImage ||
    null;

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={customer.fullName || "Customer"}
        className="h-10 w-10 shrink-0 rounded-full border object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
      {customer.fullName?.charAt(0).toUpperCase() || "C"}
    </div>
  );
};

const StatusBadge = ({ customer }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        customer.isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {customer.isActive ? "Active" : "Blocked"}
    </span>
  );
};

const CustomerActions = ({
  customer,
  onViewCustomer,
  onToggleStatus,
}) => {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onViewCustomer(customer)}
        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
        title="View Details"
      >
        <FaEye size={16} />
      </button>

      <button
        type="button"
        onClick={() => onToggleStatus(customer)}
        className={`rounded-lg p-2 transition ${
          customer.isActive
            ? "text-red-600 hover:bg-red-50 hover:text-red-700"
            : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
        title={
          customer.isActive
            ? "Block Customer"
            : "Unblock Customer"
        }
      >
        {customer.isActive ? (
          <FaBan size={16} />
        ) : (
          <FaCheck size={16} />
        )}
      </button>
    </div>
  );
};

export default CustomerTable;