import React, { useState } from "react";
import {
  FaTimes,
  FaUserTie,
  FaEnvelope,
  FaTicketAlt,
  FaCalendarAlt,
  FaExclamationCircle,
  FaLayerGroup,
  FaUser,
  FaEdit,
} from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";
import AssignTicketModal from "./AssignTicketModal";
import UpdateTicketStatusModal from "./UpdateTicketStatusModal";

const TicketDetailsModal = ({
  open,
  ticket,
  onClose,
  onAssign,
  onStatusUpdated,
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  if (!open || !ticket) {
    return null;
  }

  const customerName =
    ticket.user?.fullName ||
    ticket.user?.name ||
    ticket.customer?.fullName ||
    ticket.customer?.name ||
    "Guest Customer";

  const customerEmail =
    ticket.user?.email ||
    ticket.customer?.email ||
    "";

  const assignedAdmin = ticket.assignedTo;

  const assignedAdminName =
    assignedAdmin?.fullName ||
    assignedAdmin?.name ||
    assignedAdmin?.email ||
    "Unassigned";

  const handleAssign = async (selectedTicket, assignedTo) => {
    await onAssign?.(selectedTicket, assignedTo);
    setShowAssignModal(false);
  };

  const handleStatusUpdated = (updatedTicket) => {
    onStatusUpdated?.(updatedTicket);
    setShowUpdateStatusModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <FaTicketAlt className="text-indigo-600" />

                <h2 className="text-xl font-semibold text-gray-800">
                  Ticket Details
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {ticket.ticketNumber || ticket._id}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Subject
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-800">
                    {ticket.subject || "No subject"}
                  </h3>
                </div>

                <StatusBadge
                  type="ticket"
                  status={ticket.status}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-indigo-500" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Customer
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-gray-800">
                    {customerName}
                  </p>

                  {customerEmail && (
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <FaEnvelope size={12} />

                      <span className="truncate">
                        {customerEmail}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-indigo-500" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Assigned To
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-gray-800">
                    {assignedAdminName}
                  </p>

                  {assignedAdmin?.email && (
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <FaEnvelope size={12} />

                      <span className="truncate">
                        {assignedAdmin.email}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <FaLayerGroup className="text-indigo-500" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Category
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-gray-800">
                    {ticket.category || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <FaExclamationCircle className="text-indigo-500" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Priority
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-gray-800">
                    {ticket.priority || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-500" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Created
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-gray-800">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-500" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Updated
                    </p>
                  </div>

                  <p className="mt-2 font-semibold text-gray-800">
                    {ticket.updatedAt
                      ? new Date(ticket.updatedAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Description
                </p>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {ticket.description || "No description provided."}
                  </p>
                </div>
              </div>

              {ticket.resolution && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Resolution
                  </p>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {ticket.resolution}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Escalated
                  </p>

                  <p
                    className={`mt-2 text-sm font-semibold ${
                      ticket.isEscalated
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {ticket.isEscalated ? "Yes" : "No"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    SLA
                  </p>

                  <p
                    className={`mt-2 text-sm font-semibold ${
                      ticket.slaBreached
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {ticket.slaBreached ? "Breached" : "Within SLA"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Ticket ID
                  </p>

                  <p className="mt-2 truncate text-sm font-semibold text-gray-700">
                    {ticket.ticketNumber || ticket._id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 bg-white px-6 py-4">
            <button
              type="button"
              onClick={() => setShowUpdateStatusModal(true)}
              disabled={ticket.status === "Closed"}
              className="flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaEdit size={14} />
              Update Status
            </button>

            {ticket.status !== "Closed" && (
              <button
                type="button"
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <FaUserTie size={14} />

                {ticket.assignedTo
                  ? "Reassign"
                  : "Assign Ticket"}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <AssignTicketModal
        open={showAssignModal}
        ticket={ticket}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssign}
      />

      <UpdateTicketStatusModal
        open={showUpdateStatusModal}
        ticket={ticket}
        onClose={() => setShowUpdateStatusModal(false)}
        onUpdated={handleStatusUpdated}
      />
    </>
  );
};

export default TicketDetailsModal;