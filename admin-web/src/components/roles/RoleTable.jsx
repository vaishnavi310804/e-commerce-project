import React from "react";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const RoleTable = ({
  roles = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
        Loading roles...
      </div>
    );
  }

  // Empty state
  if (!roles.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
        No roles found.
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead className="bg-[#E0E0E0]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Role Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Description
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Permitted
                <br />
                Modules
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Assigned
                <br />
                Admins
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {roles.map((role) => (
              <tr
                key={role._id}
                className="transition hover:bg-gray-50/80"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="break-words font-semibold text-slate-800">
                      {role.name}
                    </span>

                    {role.isSystemRole && (
                      <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">
                        System Role
                      </span>
                    )}
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="whitespace-nowrap px-6 py-4">
                  <p
                    className="max-w-full truncate text-sm text-slate-500"
                    title={role.description || "No description"}
                  >
                    {role.description || "No description"}
                  </p>
                </td>

                {/* PERMISSIONS */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                    {role.permissions?.length || 0} Modules
                  </span>
                </td>

                {/* ASSIGNED ADMINS */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-base font-semibold text-slate-700">
                    {role.assignedAdminsCount ?? 0}
                  </span>
                </td>

                {/* STATUS */}
                <td className="whitespace-nowrap px-6 py-4">
                  {role.isActive ? (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      <FaCheckCircle className="text-xs" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                      <FaTimesCircle className="text-xs" />
                      Inactive
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(role)}
                      className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-[#F0EEFF] hover:text-[#6547C9]"
                      title="Edit Role"
                    >
                      <FaEdit />
                    </button>

                    {!role.isSystemRole && (
                      <button
                        type="button"
                        onClick={() => onDelete?.(role)}
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete Role"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleTable;