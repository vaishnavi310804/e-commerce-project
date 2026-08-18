import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTicketAlt,
  FaShoppingBag,
  FaExclamationTriangle,
  FaClock,
  FaUserTie,
} from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";
import AssignTicketModal from "./AssignTicketModal";

const TicketDetailsModal = ({ open, ticket, onClose, onAssign }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigning, setAssigning] = useState(false);

  if (!open || !ticket) {
    return null;
  }

  const customerName = ticket.user?.fullName || "Unknown Customer";
  const customerEmail = ticket.user?.email || "—";
  const customerPhone = ticket.user?.phoneNumber || "—";
  const orderNumber = ticket.order?.orderNumber || "No order linked";
  const assignedAdmin = ticket.assignedTo?.fullName || "Unassigned";

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getSlaText = () => {
    if (ticket.slaBreached) {
      return "SLA Breached";
    }

    if (!ticket.slaDeadline) {
      return "No SLA deadline";
    }

    const deadline = new Date(ticket.slaDeadline);
    const now = new Date();

    if (deadline <= now) {
      return "SLA Breached";
    }

    return `Due ${formatDate(ticket.slaDeadline)}`;
  };

  const handleAssignTicket = async (ticket, assignedTo) => {
    if (!assignedTo || assigning) return;

    try {
      setAssigning(true);

      await onAssign?.(ticket, assignedTo);

      setShowAssignModal(false);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
            <div>
              <div className="flex items-center gap-3">
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

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge type="ticket" status={ticket.status} />

                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  {ticket.priority}
                </span>

                {ticket.isEscalated && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    <FaExclamationTriangle size={11} />
                    Escalated
                  </span>
                )}

                {ticket.slaBreached && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    <FaClock size={11} />
                    SLA Breached
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Ticket Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">Ticket Number</p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {ticket.ticketNumber || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Category</p>

                    <p className="mt-1 font-medium text-gray-800">
                      {ticket.category || "—"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400">Subject</p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {ticket.subject || "—"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400">Description</p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {ticket.description || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <FaUser size={14} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Customer</p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {customerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <FaEnvelope size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Email</p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-800">
                        {customerEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                      <FaPhone size={14} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Phone</p>

                      <p className="mt-1 font-medium text-gray-800">
                        {customerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <FaShoppingBag size={14} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Order</p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {orderNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Assignment & SLA
                  </h3>

                  {ticket.status !== "Closed" && (
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(true)}
                      disabled={assigning}
                      className="rounded-lg bg-[#6547C9] px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {ticket.assignedTo ? "Reassign" : "Assign Ticket"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <FaUserTie size={14} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Assigned To</p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {assignedAdmin}
                      </p>

                      {ticket.assignedTo?.email && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {ticket.assignedTo.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        ticket.slaBreached
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <FaClock size={14} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">SLA</p>

                      <p
                        className={`mt-1 font-semibold ${
                          ticket.slaBreached ? "text-red-700" : "text-gray-800"
                        }`}
                      >
                        {getSlaText()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Created</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Last Updated</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>

                  {ticket.escalatedAt && (
                    <div>
                      <p className="text-xs text-gray-400">Escalated At</p>

                      <p className="mt-1 text-sm font-medium text-red-700">
                        {formatDate(ticket.escalatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {ticket.resolution && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-emerald-800">
                    Resolution
                  </h3>

                  <p className="whitespace-pre-wrap text-sm leading-6 text-emerald-700">
                    {ticket.resolution}
                  </p>

                  {ticket.resolvedAt && (
                    <p className="mt-3 text-xs text-emerald-600">
                      Resolved on {formatDate(ticket.resolvedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* {ticket.messages?.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-5">
                  <h3 className="mb-4 text-sm font-semibold text-gray-700">
                    Conversation
                  </h3>

                  <div className="space-y-4">
                    {ticket.messages.map((message, index) => (
                      <div
                        key={message._id || index}
                        className={`rounded-xl p-4 ${
                          message.senderRole === "ADMIN"
                            ? "ml-6 bg-indigo-50"
                            : "mr-6 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {message.sender?.fullName ||
                                message.senderRole}
                            </p>

                            <p className="text-xs text-gray-400">
                              {message.senderRole}
                            </p>
                          </div>

                          <p className="shrink-0 text-xs text-gray-400">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>

          <div className="flex shrink-0 justify-end border-t bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
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
        loading={assigning}
      />
    </>
  );
};

export default TicketDetailsModal;
