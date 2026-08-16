import React, { useEffect, useState } from "react";
import { FaTimes, FaTruck } from "react-icons/fa";
import { createShipment } from "../../services/shipmentApi";

const CreateShipmentModal = ({ open, orders = [], onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    orderId: "",
    courier: "",
    trackingId: "",
    trackingUrl: "",
    estimatedDelivery: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        orderId: "",
        courier: "",
        trackingId: "",
        trackingUrl: "",
        estimatedDelivery: "",
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (submitting) return;

    setFormData({
      orderId: "",
      courier: "",
      trackingId: "",
      trackingUrl: "",
      estimatedDelivery: "",
    });

    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.orderId) {
      alert("Please select an order.");
      return;
    }

    if (!formData.courier.trim()) {
      alert("Please enter the courier name.");
      return;
    }

    if (!formData.trackingId.trim()) {
      alert("Please enter the tracking ID.");
      return;
    }

    if (!formData.estimatedDelivery) {
      alert("Please select an estimated delivery date.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createShipment({
        orderId: formData.orderId,
        courier: formData.courier.trim(),
        trackingId: formData.trackingId.trim(),
        trackingUrl: formData.trackingUrl.trim() || null,
        estimatedDelivery: formData.estimatedDelivery,
      });

      onSuccess?.(response.data);
    } catch (error) {
      console.error("Failed to create shipment:", error);

      alert(error.response?.data?.message || "Failed to create shipment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Create Shipment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a shipment for an existing order.
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

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Order
                </label>

                <select
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Select an order</option>

                  {orders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.orderNumber || order._id}
                      {order.user?.fullName ? ` — ${order.user.fullName}` : ""}
                    </option>
                  ))}
                </select>

                {orders.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    No eligible orders available.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Courier
                </label>

                <input
                  type="text"
                  name="courier"
                  value={formData.courier}
                  onChange={handleChange}
                  placeholder="e.g. Delhivery, Blue Dart, DTDC"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tracking ID
                </label>

                <input
                  type="text"
                  name="trackingId"
                  value={formData.trackingId}
                  onChange={handleChange}
                  placeholder="Enter tracking ID"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tracking URL
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="url"
                  name="trackingUrl"
                  value={formData.trackingUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Estimated Delivery
                </label>

                <input
                  type="date"
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t bg-white px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || orders.length === 0}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipmentModal;
