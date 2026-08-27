import React from "react";
import { FaEye } from "react-icons/fa";

const AuditLogTable = ({ logs = [], loading, onViewDetails }) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading audit logs...
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No audit log records found.
      </div>
    );
  }

  const renderActionBadge = (action) => {
    let colorClasses = "bg-gray-100 text-gray-700 border-gray-300";
    if (action === "ADMIN_CREATED") colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (action === "ADMIN_UPDATED") colorClasses = "bg-blue-100 text-blue-800 border-blue-300";
    if (action === "ADMIN_ACTIVATED") colorClasses = "bg-green-100 text-green-800 border-green-300";
    if (action === "ADMIN_DEACTIVATED") colorClasses = "bg-red-100 text-red-800 border-red-300";

    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border ${colorClasses}`}>
        {action}
      </span>
    );
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-[#E0E0E0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Date / Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actor (Performed By)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Target Admin
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Description
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => {
                const actorName = log.actorId?.fullName || "System";
                const actorRole = log.actorRole || log.actorId?.role || "—";
                const targetName = log.targetId?.fullName || "—";

                return (
                  <tr
                    key={log._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-600">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{actorName}</p>
                        <span className="inline-flex rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
                          {actorRole}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {renderActionBadge(log.action)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {targetName}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={log.description}>
                      {log.description}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onViewDetails(log)}
                        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                        title="View Log Details"
                      >
                        <FaEye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {logs.map((log) => {
          const actorName = log.actorId?.fullName || "System";

          return (
            <div key={log._id} className="rounded-xl bg-white p-4 shadow space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                </span>
                {renderActionBadge(log.action)}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">{log.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By: <span className="font-medium text-gray-700">{actorName}</span> ({log.actorRole})
                </p>
              </div>

              <div className="flex items-center justify-end border-t border-gray-100 pt-2">
                <button
                  type="button"
                  onClick={() => onViewDetails(log)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AuditLogTable;
