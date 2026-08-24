import React, { useEffect, useState } from "react";
import { FaTimes, FaUserTie, FaEnvelope, FaCheck } from "react-icons/fa";
import { getAllAdmins } from "../../services/authApi";

const AssignTicketModal = ({
  open,
  ticket,
  onClose,
  onAssign,
  processing = false,
}) => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchAdmins = async () => {
      try {
        setLoadingAdmins(true);

        const adminsData = await getAllAdmins();

        setAdmins(Array.isArray(adminsData) ? adminsData : []);

        if (ticket?.assignedTo?._id) {
          setSelectedAdmin(ticket.assignedTo._id);
        } else {
          setSelectedAdmin("");
        }
      } catch (error) {
        console.error("FAILED TO FETCH ADMINS:", error);
        setAdmins([]);
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchAdmins();
  }, [open, ticket]);

  if (!open || !ticket) {
    return null;
  }

  const handleClose = () => {
    if (processing) return;

    setSelectedAdmin("");
    onClose();
  };

  const handleAssign = () => {
    if (!selectedAdmin || processing) return;

    onAssign?.(ticket, selectedAdmin);
  };

  const selectedAdminDetails = admins.find(
    (admin) => String(admin._id) === String(selectedAdmin),
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <FaUserTie className="text-indigo-600" />

              <h2 className="text-xl font-semibold text-gray-800">
                Assign Ticket
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Assign this ticket to an admin.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={processing}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400">Ticket</p>

            <p className="mt-1 font-semibold text-gray-800">
              {ticket.ticketNumber || ticket._id}
            </p>

            <p className="mt-1 truncate text-sm text-gray-500">
              {ticket.subject || "—"}
            </p>
          </div>

          <div>
            <label
              htmlFor="assignedAdmin"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Assign To
            </label>

            {loadingAdmins ? (
              <div className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">
                Loading admins...
              </div>
            ) : (
              <select
                id="assignedAdmin"
                value={selectedAdmin}
                onChange={(event) => setSelectedAdmin(event.target.value)}
                disabled={processing}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">Select an admin</option>

                {admins.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.fullName || admin.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedAdminDetails && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-indigo-600">
                  <FaUserTie size={16} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-gray-800">
                    {selectedAdminDetails.fullName || "Admin"}
                  </p>

                  {selectedAdminDetails.email && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <FaEnvelope size={11} />

                      <span className="truncate">
                        {selectedAdminDetails.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {admins.length === 0 && !loadingAdmins && (
            <p className="text-sm text-red-600">
              No admins are available for assignment.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={processing}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedAdmin || processing || loadingAdmins}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Assigning..." : "Assign Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTicketModal;
