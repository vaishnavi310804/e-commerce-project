import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTicketAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaUserTie,
  FaEdit,
} from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";
import AssignTicketModal from "./AssignTicketModal";
import UpdateTicketStatusModal from "./UpdateTicketStatusModal";
import { escalateTicket } from "../../services/ticketApi";

const TicketDetailsModal = ({
  open,
  ticket,
  onClose,
  onAssign,
  onUpdated,
  onEscalated,
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [escalating, setEscalating] = useState(false);

  if (!open || !ticket) {
    return null;
  }

  const handleClose = () => {
    if (escalating) return;

    setShowAssignModal(false);
    setShowUpdateStatusModal(false);
    onClose();
  };

  const handleEscalate = async () => {
    if (escalating || ticket.isEscalated || ticket.status === "Closed") return;

    try {
      setEscalating(true);

      const response = await escalateTicket(ticket._id);
      const updatedTicket = response?.data || response;

      onEscalated?.(updatedTicket);
    } catch (error) {
      console.error("FAILED TO ESCALATE TICKET:", error);

      alert(
        error.response?.data?.message ||
          "Failed to escalate ticket.",
      );
    } finally {
      setEscalating(false);
    }
  };

  const handleAssignTicket = async (ticketData, assignedTo) => {
    await onAssign?.(ticketData, assignedTo);
    setShowAssignModal(false);
  };

  const handleTicketUpdated = (updatedTicket) => {
    onUpdated?.(updatedTicket);
    setShowUpdateStatusModal(false);
  };

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

  const customerPhone =
    ticket.user?.phoneNumber ||
    ticket.user?.phone ||
    ticket.customer?.phoneNumber ||
    ticket.customer?.phone ||
    "";

  const assignedAdmin = ticket.assignedTo;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <div className="flex items-center gap-3">

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Ticket Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {ticket.ticketNumber || ticket._id}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={escalating}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      type="ticket"
                      status={ticket.status}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-400">
                    Priority
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {ticket.priority || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-400">
                    Category
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {ticket.category || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-400">
                    Created
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <FaCalendarAlt className="text-gray-400" />

                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Subject
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-800">
                  {ticket.subject || "No subject"}
                </h3>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Description
                </p>

                <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {ticket.description || "No description provided."}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaUser className="text-indigo-600" />

                    <h3 className="font-semibold text-gray-800">
                      Customer
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Name</p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {customerName}
                      </p>
                    </div>

                    {customerEmail && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-gray-400" />
                        <span>{customerEmail}</span>
                      </div>
                    )}

                    {customerPhone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-gray-400" />
                        <span>{customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaUserTie className="text-indigo-600" />

                      <h3 className="font-semibold text-gray-800">
                        Assigned Admin
                      </h3>
                    </div>

                    {ticket.status !== "Closed" && (
                      <button
                        type="button"
                        onClick={() => setShowAssignModal(true)}
                        disabled={escalating}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {assignedAdmin
                          ? "Reassign"
                          : "Assign Ticket"}
                      </button>
                    )}
                  </div>

                  {assignedAdmin ? (
                    <div className="rounded-xl bg-indigo-50 p-4">
                      <p className="font-semibold text-gray-800">
                        {assignedAdmin.fullName ||
                          assignedAdmin.name ||
                          "Admin"}
                      </p>

                      {assignedAdmin.email && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <FaEnvelope size={11} />

                          <span>{assignedAdmin.email}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                      Unassigned
                    </div>
                  )}
                </div>
              </div>

              {(ticket.isEscalated || ticket.slaBreached) && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ticket.isEscalated && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <FaExclamationTriangle className="text-red-600" />

                      <div>
                        <p className="text-sm font-semibold text-red-700">
                          Escalated Ticket
                        </p>

                        <p className="text-xs text-red-600">
                          This ticket has been escalated.
                        </p>
                      </div>
                    </div>
                  )}

                  {ticket.slaBreached && (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <FaExclamationTriangle className="text-amber-600" />

                      <div>
                        <p className="text-sm font-semibold text-amber-700">
                          SLA Breached
                        </p>

                        <p className="text-xs text-amber-600">
                          The SLA for this ticket has been breached.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {ticket.resolution && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Resolution
                  </p>

                  <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-gray-700">
                    {ticket.resolution}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 bg-gray-50 px-6 py-4">
            {ticket.status !== "Closed" && (
              <button
                type="button"
                onClick={() => setShowUpdateStatusModal(true)}
                disabled={escalating}
                className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaEdit size={14} />
                Update Status
              </button>
            )}

            {ticket.status !== "Closed" && !ticket.isEscalated && (
              <button
                type="button"
                onClick={handleEscalate}
                disabled={escalating}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaExclamationTriangle size={14} />
                {escalating ? "Escalating..." : "Escalate Ticket"}
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              disabled={escalating}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
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
        onAssign={handleAssignTicket}
        processing={escalating}
      />

      <UpdateTicketStatusModal
        open={showUpdateStatusModal}
        ticket={ticket}
        onClose={() => setShowUpdateStatusModal(false)}
        onUpdated={handleTicketUpdated}
      />
    </>
  );
};

export default TicketDetailsModal;