import React, { useEffect, useState } from "react";
import { FaTimes, FaEdit } from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";
import { updateTicketStatus } from "../../services/ticketApi";

const statuses = ["Open", "In Progress", "Resolved", "Closed"];

const UpdateTicketStatusModal = ({ open, ticket, onClose, onUpdated }) => {
  const [status, setStatus] = useState("");
  const [resolution, setResolution] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!open || !ticket) return;

    setStatus(ticket.status || "Open");
    setResolution(ticket.resolution || "");
  }, [open, ticket]);

  if (!open || !ticket) {
    return null;
  }

  const handleUpdate = async () => {
    if (!status || updating) return;

    if (status === "Resolved" && !resolution.trim()) {
      alert("Please enter a resolution before resolving the ticket.");
      return;
    }

    try {
      setUpdating(true);

      const response = await updateTicketStatus(ticket._id, status, resolution);

      const updatedTicket = response?.data || response;

      onUpdated?.(updatedTicket);

      onClose();
    } catch (error) {
      console.error("FAILED TO UPDATE TICKET STATUS:", error);

      alert(error.response?.data?.message || "Failed to update ticket status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Ticket Status
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Change the current status of this ticket.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="space-y-2 px-6 py-4">
          <p className="text-xs font-semibold text-gray-400">Ticket</p>

          <p className="mt-1 font-semibold text-gray-800">
            {ticket.ticketNumber || ticket._id}
          </p>

          <p className="mt-1 truncate text-sm text-gray-500">
            {ticket.subject || "—"}
          </p>

          <div className="mt-3">
            <StatusBadge type="ticket" status={ticket.status} />
          </div>

          <div>
            <label
              htmlFor="ticketStatus"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Status
            </label>

            <select
              id="ticketStatus"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={updating}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {(status === "Resolved" || status === "Closed") && (
            <div>
              <label
                htmlFor="ticketResolution"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Resolution
              </label>

              <textarea
                id="ticketResolution"
                value={resolution}
                onChange={(event) => setResolution(event.target.value)}
                disabled={updating}
                rows={4}
                placeholder="Enter the resolution..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={
              updating ||
              !status ||
              (status === ticket.status &&
                resolution === (ticket.resolution || ""))
            }
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTicketStatusModal;
