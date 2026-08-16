import React from "react";
import { FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";

const ShipmentDetailsModal = ({ open, shipment, loading = false, onClose }) => {
  if (!open) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime()) ? "—" : date.toLocaleString();
  };

  const customerName =
    shipment?.order?.user?.fullName ||
    shipment?.order?.user?.name ||
    shipment?.order?.shippingAddress?.fullName ||
    "Guest Customer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Shipment Details
            </h2>

            {shipment?.order?.orderNumber && (
              <p className="mt-1 text-sm text-gray-500">
                Order #{shipment.order.orderNumber}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading shipment details...
            </div>
          ) : !shipment ? (
            <div className="p-8 text-center text-gray-500">
              Shipment details not found.
            </div>
          ) : (
            <div className="space-y-6 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
                <div>
                  <p className="text-xs font-medium text-gray-800">
                    Shipment Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge type="shipment" status={shipment.status} />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-gray-400">
                    Tracking ID
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {shipment.trackingId || "—"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-800">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">Customer</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {shipment.order?.user?.email || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {shipment.order?.user?.phoneNumber ||
                        shipment.order?.shippingAddress?.phoneNumber ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {shipment.order?.orderNumber || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-800">
                  Shipment Information
                </h3>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">Courier</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {shipment.courier || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Tracking ID</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {shipment.trackingId || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Estimated Delivery</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {formatDate(shipment.estimatedDelivery)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {formatDateTime(shipment.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Shipped At</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {formatDateTime(shipment.shippedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Delivered At</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {formatDateTime(shipment.deliveredAt)}
                    </p>
                  </div>

                  {shipment.trackingUrl && (
                    <div className="sm:col-span-2">
                      <a
                        href={shipment.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
                      >
                        Track Shipment
                        <FaExternalLinkAlt size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-800">
                  Shipment Timeline
                </h3>

                {shipment.timeline?.length > 0 ? (
                  <div className="relative ml-2">
                    {shipment.timeline.map((event, index) => (
                      <div
                        key={`${event.status}-${event.timestamp}-${index}`}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        {index !== shipment.timeline.length - 1 && (
                          <div className="absolute left-[7px] top-3 h-full w-px bg-gray-200" />
                        )}

                        <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-indigo-600 bg-white" />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <StatusBadge
                              type="shipment"
                              status={event.status}
                            />

                            <span className="text-xs text-gray-400">
                              {formatDateTime(event.timestamp)}
                            </span>
                          </div>

                          {event.message && (
                            <p className="mt-2 text-sm text-gray-700">
                              {event.message}
                            </p>
                          )}

                          {event.location && (
                            <p className="mt-1 text-xs text-gray-500">
                              Location: {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-500">
                    No timeline events available.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsModal;
