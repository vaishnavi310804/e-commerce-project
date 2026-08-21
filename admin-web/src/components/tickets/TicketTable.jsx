import React from 'react'
import StatusBadge from '../orders/StatusBadge';
import { FaEye, FaExclamationTriangle, FaClock } from "react-icons/fa";

const priorityStyles = {
  Low: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

const TicketTable = ({
  tickets,
  loading,
  onViewTicket,
}) => {
    if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading tickets...
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No tickets found.
      </div>
    );
  }
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Ticket ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Subject
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Priority
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  SLA
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Created Date
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => {
                const customerName =
                  ticket.user?.fullName ||
                  ticket.user?.name ||
                  "Unknown Customer";

                return (
                  <tr
                    key={ticket._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-800">
                      {ticket.ticketNumber || ticket._id?.substring(18)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      <div className="font-medium text-gray-900">
                        {customerName}
                      </div>

                      <div className="text-xs text-gray-500">
                        {ticket.user?.email || ""}
                      </div>
                    </td>

                    <td className="max-w-[220px] px-6 py-4">
                      <p
                        className="truncate font-medium text-gray-800"
                        title={ticket.subject}
                      >
                        {ticket.subject || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex max-w-[180px] rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {ticket.category || "—"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[ticket.priority] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {ticket.priority || "Medium"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge
                        type="ticket"
                        status={ticket.status}
                      />
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {ticket.slaBreached ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                          Breached
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                          Within SLA
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <TicketActions
                        ticket={ticket}
                        onViewTicket={onViewTicket}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {tickets.map((ticket) => {
          const customerName =
            ticket.user?.fullName ||
            ticket.user?.name ||
            "Unknown Customer";

          return (
            <div
              key={ticket._id}
              className="rounded-xl bg-white p-4 shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    Ticket ID
                  </p>

                  <h3 className="mt-1 truncate text-sm font-bold text-gray-900">
                    {ticket.ticketNumber || ticket._id?.substring(18)}
                  </h3>
                </div>

                <TicketActions
                  ticket={ticket}
                  onViewTicket={onViewTicket}
                />
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">Customer</p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {customerName}
                </p>

                {ticket.user?.email && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {ticket.user.email}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">Subject</p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {ticket.subject || "—"}
                </p>
              </div>

              <div className="mt-4 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Category</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {ticket.category || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Priority</p>

                    <span
                      className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        priorityStyles[ticket.priority] ||
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {ticket.priority || "Medium"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">SLA</p>

                    {ticket.slaBreached ? (
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                        <FaExclamationTriangle size={11} />
                        Breached
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <FaClock size={11} />
                        Within SLA
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Created</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {ticket.createdAt
                        ? new Date(
                            ticket.createdAt,
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-gray-100 pt-3">
                <p className="mb-1 text-xs text-gray-400">
                  Status
                </p>

                <StatusBadge
                  type="ticket"
                  status={ticket.status}
                />
              </div>

              {ticket.isEscalated && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  <FaExclamationTriangle size={12} />
                  Escalated Ticket
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

const TicketActions = ({
  ticket,
  onViewTicket,
}) => {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onViewTicket(ticket)}
        className="rounded-lg p-2 text-[#6547C9] transition hover:bg-indigo-50 hover:text-indigo-700"
        title="View Details"
      >
        <FaEye size={16} />
      </button>
    </div>
  );
};

export default TicketTable
