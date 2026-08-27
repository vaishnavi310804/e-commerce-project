import React from "react";
import { FaTimes, FaGlobe, FaDesktop, FaUser, FaClock, FaTag } from "react-icons/fa";

const AuditLogDetailsModal = ({ open, onClose, log }) => {
  if (!open || !log) return null;

  const actorName = log.actorId?.fullName || "System / Unknown";
  const actorEmail = log.actorId?.email || "—";
  const targetName = log.targetId?.fullName || log.targetId || "—";
  const targetEmail = log.targetId?.email || "—";

  const renderBadge = (action) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Audit Log Details
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Log ID: {log._id}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <FaUser className="text-indigo-500" /> Performed By (Actor)
              </h3>
              <p className="font-semibold text-gray-900">{actorName}</p>
              <p className="text-xs text-gray-600">{actorEmail}</p>
              <div>
                <span className="inline-flex rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                  {log.actorRole || "—"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <FaTag className="text-indigo-500" /> Target Resource
              </h3>
              <p className="font-semibold text-gray-900">{targetName}</p>
              <p className="text-xs text-gray-600">{targetEmail}</p>
              <p className="text-xs text-gray-500">Type: {log.targetType || "ADMIN"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Action</span>
                <div className="mt-1">{renderBadge(log.action)}</div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Module</span>
                <span className="text-sm font-medium text-gray-800">{log.module || "ADMIN_USER"}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                  <FaClock className="text-gray-400" /> Timestamp
                </span>
                <span className="text-sm text-gray-700">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Description</span>
              <p className="mt-1 rounded-lg bg-indigo-50/50 p-3 text-sm font-medium text-indigo-900 border border-indigo-100">
                {log.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="flex items-center gap-2 text-gray-600 rounded-lg bg-gray-50 p-3 border border-gray-100">
              <FaGlobe className="text-gray-400 text-base shrink-0" />
              <div>
                <span className="font-semibold block text-gray-700">IP Address</span>
                <span className="font-mono">{log.ipAddress || "Not Recorded"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600 rounded-lg bg-gray-50 p-3 border border-gray-100">
              <FaDesktop className="text-gray-400 text-base shrink-0" />
              <div className="truncate">
                <span className="font-semibold block text-gray-700">User Agent</span>
                <span className="font-mono truncate block" title={log.userAgent}>{log.userAgent || "Not Recorded"}</span>
              </div>
            </div>
          </div>

          {log.changes && (log.changes.before || log.changes.after) && (
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Data Changes Breakdown
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-semibold text-red-600 block mb-1">Before State</span>
                  <pre className="overflow-x-auto rounded-lg bg-red-50/60 p-3 text-xs font-mono text-red-900 border border-red-100 max-h-40">
                    {log.changes.before
                      ? JSON.stringify(log.changes.before, null, 2)
                      : "null (Created)"}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-semibold text-emerald-600 block mb-1">After State</span>
                  <pre className="overflow-x-auto rounded-lg bg-emerald-50/60 p-3 text-xs font-mono text-emerald-900 border border-emerald-100 max-h-40">
                    {log.changes.after
                      ? JSON.stringify(log.changes.after, null, 2)
                      : "null"}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-gray-100 px-6 py-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetailsModal;
