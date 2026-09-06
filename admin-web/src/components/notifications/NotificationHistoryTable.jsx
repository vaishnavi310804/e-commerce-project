import React from "react";
import { FaBell, FaUser, FaClock, FaPaperPlane } from "react-icons/fa";

const NotificationHistoryTable = ({ history = [], loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#6547C9] border-t-transparent" />
        <p className="text-sm font-medium">Loading notification history...</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow">
        <h3 className="text-base font-bold text-gray-800">No notification history found.</h3>
        <p className="mt-1 text-xs text-gray-500">
          Promotional notifications sent to customers will appear here.
        </p>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    const day = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day}, ${time}`;
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-[#E0E0E0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Sent By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Date & Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {history.map((item) => {
                const adminName =
                  item.sentBy?.name || item.sentBy?.fullName || "Admin User";
                const adminEmail = item.sentBy?.email || "";

                return (
                  <tr
                    key={item._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                      <p className="line-clamp-2">{item.message}</p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="font-semibold text-gray-900">
                        {adminName}
                      </div>
                      {adminEmail && (
                        <div className="text-xs text-gray-500">
                          {adminEmail}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(item.createdAt || item.sentAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="space-y-3 md:hidden">
        {history.map((item) => {
          const adminName =
            item.sentBy?.name || item.sentBy?.fullName || "Admin User";
          const adminEmail = item.sentBy?.email || "";

          return (
            <div
              key={item._id}
              className="rounded-xl bg-white p-4 shadow space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-gray-900 text-base">
                  {item.title}
                </h3>
                <span className="text-xs text-gray-500 shrink-0">
                  {formatDateTime(item.createdAt || item.sentAt)}
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.message}
              </p>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-gray-800">
                  Sent by: {adminName}
                </span>
                {adminEmail && <span>{adminEmail}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationHistoryTable;
