import React, { useEffect, useState } from "react";
import { FaTimes, FaTruck } from "react-icons/fa";
import { updateShipmentStatus } from "../../services/shipmentApi";
import StatusBadge from "../orders/StatusBadge";

const statusTransitions = {
  Pending: ["Processing", "Shipped", "Cancelled"],
  Processing: ["Shipped", "Failed", "Cancelled"],
  Shipped: ["In Transit", "Out for Delivery", "Failed", "Cancelled"],
  "In Transit": ["Out for Delivery", "Failed", "Cancelled"],
  "Out for Delivery": ["Delivered", "Failed"],
  Delivered: [],
  Failed: ["Processing", "Cancelled"],
  Cancelled: [],
};

const UpdateShipmentStatus = ({
  open,
  shipment,
  onClose,
  onSuccess,
}) => {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && shipment) {
      setStatus("");
      setMessage("");
      setLocation("");
    }
  }, [open, shipment]);

  if (!open || !shipment) return null;

  const currentStatus = shipment.status || "Pending";
  const availableStatuses = statusTransitions[currentStatus] || [];

  const handleClose = () => {
    if (submitting) return;

    setStatus("");
    setMessage("");
    setLocation("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      alert("Please select a shipment status.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await updateShipmentStatus(shipment._id, {
        status,
        message: message.trim(),
        location: location.trim(),
      });

      onSuccess?.(response.data);

      handleClose();
    } catch (error) {
      console.error("Failed to update shipment status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update shipment status.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">

    <div className="flex shrink-0 items-center justify-between px-6 py-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Update Shipment Status
        </h2>

        <p className="mt-1 text-lg text-gray-500">
          Order #{shipment?.order?.orderNumber || "—"}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaTimes size={24} />
      </button>
    </div>

    <form
      onSubmit={handleSubmit}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">

          <div className="rounded-2xl p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Current Status
                </p>

                <div className="mt-3">
                  <StatusBadge
                    type="shipment"
                    status={shipment?.status}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700">
              New Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              {availableStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Enter shipment update message"
              className="w-full resize-none rounded-xl border border-gray-300 px-5 py-4 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter current location"
              className="w-full rounded-xl border border-gray-300 px-5 py-4 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

        </div>
      </div>

      <div className="flex shrink-0 justify-end gap-3 border-t bg-white px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Status"}
        </button>
      </div>

    </form>
  </div>
</div>
  );
};

export default UpdateShipmentStatus;