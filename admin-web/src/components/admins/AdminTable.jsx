import React from "react";
import { FaEdit } from "react-icons/fa";

const AdminTable = ({
  admins = [],
  loading,
  onEdit,
  onToggleStatus,
  currentUserId,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading admin users...
      </div>
    );
  }

  if (!admins || admins.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No admin users found.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-[#E0E0E0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Admin Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => {
                const isSelf = currentUserId && String(admin._id) === String(currentUserId);
                const initialLetter = (admin.fullName || "A").charAt(0).toUpperCase();

                return (
                  <tr
                    key={admin._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0EEFF] font-bold text-[#6547C9]">
                          {initialLetter}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {admin.fullName || "—"}
                            {isSelf && (
                              <span className="ml-2 rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {admin.email || "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
                        {admin.role || "ADMIN"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          admin.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {admin.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(admin)}
                          className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                          title="Edit Admin"
                        >
                          <FaEdit size={16} />
                        </button>

                        <StatusToggle
                          admin={admin}
                          isSelf={isSelf}
                          onToggleStatus={onToggleStatus}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {admins.map((admin) => {
          const isSelf = currentUserId && String(admin._id) === String(currentUserId);
          const initialLetter = (admin.fullName || "A").charAt(0).toUpperCase();

          return (
            <div key={admin._id} className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0EEFF] font-bold text-[#6547C9]">
                    {initialLetter}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {admin.fullName}
                      {isSelf && (
                        <span className="ml-2 rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="truncate text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onEdit(admin)}
                  className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                  title="Edit Admin"
                >
                  <FaEdit size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      admin.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <StatusToggle
                    admin={admin}
                    isSelf={isSelf}
                    onToggleStatus={onToggleStatus}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const StatusToggle = ({ admin, isSelf, onToggleStatus }) => {
  const isDisabled = isSelf && admin.isActive;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onToggleStatus(admin)}
      title={
        isDisabled
          ? "You cannot deactivate your own account"
          : admin.isActive
          ? "Deactivate Admin"
          : "Activate Admin"
      }
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        admin.isActive ? "bg-green-500" : "bg-red-500"
      } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          admin.isActive ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default AdminTable;
