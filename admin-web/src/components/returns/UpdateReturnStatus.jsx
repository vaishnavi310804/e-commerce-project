import React, { useEffect, useMemo, useState } from "react";
import { FaTimes, FaExchangeAlt } from "react-icons/fa";
import { updateReturnStatus } from "../../services/returnApi";
import StatusBadge from "../orders/StatusBadge";

const UpdateReturnStatus = ({
  open,
  returnItem,
  onClose,
  onSuccess,
}) => {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableStatuses = useMemo(() => {
    const transitions = {
      Pending: ["Approved", "Rejected"],
      Approved: ["Picked Up"],
      "Picked Up": ["Completed"],
      Rejected: [],
      Completed: [],
    };

    return transitions[returnItem?.status] || [];
  }, [returnItem]);

  useEffect(() => {
    if (open) {
      setStatus(availableStatuses[0] || "");
    }
  }, [open, availableStatuses]);

  if (!open || !returnItem) return null;

  const handleClose = () => {
    if (submitting) return;

    setStatus("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      alert("Please select a status.");
      return;
    }

    try {
      setSubmitting(true);

      await updateReturnStatus(returnItem._id, status);

      onSuccess?.(status);
    } catch (error) {
      console.error("Failed to update return status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update return status.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Update Return Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the current return request status.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {returnItem.order?.orderNumber || "—"}
                  </p>
                </div>

                <StatusBadge
                  type="return"
                  status={returnItem.status}
                />
              </div>
            </div>

            {availableStatuses.length > 0 ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">Select status</option>

                  {availableStatuses.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <FaExchangeAlt className="mx-auto mb-2 text-gray-400" />

                <p className="text-sm font-medium text-gray-700">
                  No further status updates available.
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  This return has reached a final status.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 bg-white px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {availableStatuses.length > 0 && (
              <button
                type="submit"
                disabled={submitting || !status}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Status"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateReturnStatus;