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
                <FaUser className="text-indigo-500" /> Performed By
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
                <FaTag className="text-indigo-500" /> Target
              </h3>
              <p className="font-semibold text-gray-900">{targetName}</p>
              <p className="text-xs text-gray-600">{targetEmail}</p>
              <p className="text-xs text-gray-500">Type: {log.targetType || "ADMIN"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Action</span>
                <div className="mt-1">{renderBadge(log.action)}</div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block flex items-center">
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
        </div>

        <div className="flex items-center justify-end border-t border-gray-100 px-6 py-3">
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
