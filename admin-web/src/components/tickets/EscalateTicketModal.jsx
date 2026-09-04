import React, { useEffect, useState } from "react";
import { FaTimes, FaExclamationTriangle, FaUserTie, FaEnvelope } from "react-icons/fa";
import { getEscalationTargets } from "../../services/ticketApi";
import { useAuth } from "../../context/AuthContext";

const EscalateTicketModal = ({
  open,
  ticket,
  onClose,
  onEscalate,
  processing = false,
}) => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchAdmins = async () => {
      try {
        setLoadingAdmins(true);
        setFetchError(false);
        const response = await getEscalationTargets();
        const rawAdmins = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];

        setAdmins(rawAdmins);
        setSelectedAdmin("");
      } catch (error) {
        console.error("FAILED TO FETCH ADMINS FOR ESCALATION:", error);
        setFetchError(true);
        setAdmins([]);
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchAdmins();
  }, [open, ticket, user]);

  if (!open || !ticket) {
    return null;
  }

  const handleClose = () => {
    if (processing) return;
    setSelectedAdmin("");
    onClose();
  };

  const handleEscalate = () => {
    if (!selectedAdmin || processing) return;
    onEscalate?.(ticket, selectedAdmin);
  };

  const selectedAdminDetails = admins.find(
    (admin) => String(admin._id) === String(selectedAdmin),
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" size={18} />
              <h2 className="text-xl font-semibold text-gray-800">
                Escalate Ticket
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Select an admin to take over this ticket.
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
          <div className="rounded-xl bg-gray-50 p-4">
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
              htmlFor="escalationTargetAdmin"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Escalate To
            </label>

            {loadingAdmins ? (
              <div className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">
                Loading eligible admins...
              </div>
            ) : (
              <select
                id="escalationTargetAdmin"
                value={selectedAdmin}
                onChange={(event) => setSelectedAdmin(event.target.value)}
                disabled={processing || fetchError || admins.length === 0}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">Select an admin to escalate to</option>

                {admins.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.fullName || admin.email} ({admin.roleId?.name || admin.role || "ADMIN"})
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedAdminDetails && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-red-600">
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

          {!loadingAdmins && fetchError && (
            <p className="text-sm text-red-600">
              Unable to load eligible admins.
            </p>
          )}

          {!loadingAdmins && !fetchError && admins.length === 0 && (
            <p className="text-sm text-red-600">
              No eligible admins are available for escalation.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={processing}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleEscalate}
            disabled={!selectedAdmin || processing || loadingAdmins}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Escalating..." : "Escalate Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscalateTicketModal;
