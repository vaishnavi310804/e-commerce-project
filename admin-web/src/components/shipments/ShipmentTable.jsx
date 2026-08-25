import React from "react";
import { FaEye, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";

const ShipmentTable = ({
  shipments,
  loading,
  onViewShipment,
  onUpdateStatus,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        Loading shipments...
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
        No shipments found.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleString();
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse">
            <thead className="bg-[#E0E0E0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Order ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Courier
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Tracking ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Estimated Delivery
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Created
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {shipments.map((shipment) => {
                const customerName =
                  shipment.order?.user?.fullName ||
                  shipment.order?.user?.name ||
                  shipment.order?.shippingAddress?.fullName ||
                  "Guest Customer";

                const orderNumber =
                  shipment.order?.orderNumber || "—";

                return (
                  <tr
                    key={shipment._id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {orderNumber}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="font-medium text-gray-900">
                        {customerName}
                      </div>

                      {shipment.order?.user?.email && (
                        <div className="text-xs text-gray-500">
                          {shipment.order.user.email}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {shipment.courier || "—"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {shipment.trackingId || "—"}
                        </span>

                        {shipment.trackingUrl && (
                          <a
                            href={shipment.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                            title="Track Shipment"
                          >
                            <FaExternalLinkAlt size={12} />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        type="shipment"
                        status={shipment.status}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(shipment.estimatedDelivery)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(shipment.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <ShipmentActions
                        shipment={shipment}
                        onViewShipment={onViewShipment}
                        onUpdateStatus={onUpdateStatus}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {shipments.map((shipment) => {
          const customerName =
            shipment.order?.user?.fullName ||
            shipment.order?.user?.name ||
            shipment.order?.shippingAddress?.fullName ||
            "Guest Customer";

          const orderNumber =
            shipment.order?.orderNumber || "—";

          return (
            <div
              key={shipment._id}
              className="rounded-xl bg-white p-4 shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    Order ID
                  </p>

                  <h3 className="mt-0.5 truncate text-sm font-bold text-gray-900">
                    {orderNumber}
                  </h3>
                </div>

                <StatusBadge
                  type="shipment"
                  status={shipment.status}
                />
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">
                  Customer
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                  {customerName}
                </p>

                {shipment.order?.user?.email && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {shipment.order.user.email}
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-lg bg-gray-50/50 p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Courier
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {shipment.courier || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Tracking ID
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-gray-700">
                        {shipment.trackingId || "—"}
                      </p>

                      {shipment.trackingUrl && (
                        <a
                          href={shipment.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-indigo-600"
                          title="Track Shipment"
                        >
                          <FaExternalLinkAlt size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Estimated Delivery
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(shipment.estimatedDelivery)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(shipment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                <ShipmentActions
                  shipment={shipment}
                  onViewShipment={onViewShipment}
                  onUpdateStatus={onUpdateStatus}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const ShipmentActions = ({
  shipment,
  onViewShipment,
  onUpdateStatus,
}) => {
  const isFinalStatus = ["Delivered", "Cancelled"].includes(
    shipment.status,
  );

  return (
    <div className="flex shrink-0 items-center gap-1">
      {onViewShipment && (
        <button
          type="button"
          onClick={() => onViewShipment(shipment)}
          className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          title="View Shipment Details"
        >
          <FaEye size={16} />
        </button>
      )}

      {!isFinalStatus && onUpdateStatus && (
        <button
          type="button"
          onClick={() => onUpdateStatus(shipment)}
          className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 hover:text-purple-700"
          title="Update Shipment Status"
        >
          <FaEdit size={16} />
        </button>
      )}
    </div>
  );
};

export default ShipmentTable;