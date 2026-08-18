import React from "react";
import { FaTimes, FaUndoAlt } from "react-icons/fa";
import StatusBadge from "../orders/StatusBadge";

const ReturnDetailsModal = ({ open, returnItem, onClose }) => {
  if (!open || !returnItem) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const customerName =
    returnItem.user?.fullName ||
    returnItem.user?.name ||
    returnItem.order?.shippingAddress?.fullName ||
    "Guest Customer";

  const customerEmail = returnItem.user?.email || "—";

  const customerPhone =
    returnItem.user?.phoneNumber ||
    returnItem.order?.shippingAddress?.phoneNumber ||
    "—";

  const orderNumber = returnItem.order?.orderNumber || "—";

  const getRefundBadge = () => {
    const status = returnItem.refundStatus || "Not Processed";

    switch (status) {
      case "Processed":
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Refunded
          </span>
        );

      case "Failed":
        return (
          <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            Failed
          </span>
        );

      case "Pending":
        return (
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            Pending
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
            Not Processed
          </span>
        );
    }
  };

  const isRejected = Boolean(returnItem.rejectedAt) || returnItem.status === "Rejected";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Return Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">Order #{orderNumber}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Return Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {orderNumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Requested At</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatDateTime(returnItem.requestedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Reason</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {returnItem.reason || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Return Status</p>

                  <div className="mt-1">
                    <StatusBadge type="return" status={returnItem.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Refund Status</p>

                  <div className="mt-1">{getRefundBadge()}</div>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Refund Amount</p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    ₹{Number(returnItem.refundAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">Name</p>

                  <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                    {customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Email</p>

                  <p className="mt-1 truncate text-sm font-medium text-gray-700">
                    {customerEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {customerPhone}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Returned Items
              </h3>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Product
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Quantity
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Price
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {returnItem.items?.map((item, index) => {
                        const product = item.product;

                        const returnedProductId = product?._id || product;

                        const orderItem = returnItem.order?.products?.find(
                          (orderItem) => {
                            const orderProductId =
                              orderItem.product?._id || orderItem.product;

                            return (
                              String(orderProductId) ===
                              String(returnedProductId)
                            );
                          },
                        );

                        const price = Number(orderItem?.price || 0);

                        const amount = price * Number(item.quantity || 0);

                        return (
                          <tr key={item.product?._id || index}>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {product?.productImage || product?.image ? (
                                  <img
                                    src={
                                      product.productImage?.url ||
                                      product.image ||
                                      ""
                                    }
                                    alt={product?.name || "Product"}
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                    <FaUndoAlt className="text-gray-400" />
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-gray-800">
                                    {product?.name || "Product"}
                                  </p>

                                  {product?.brand && (
                                    <p className="text-xs text-gray-500">
                                      {product.brand}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-center text-sm font-medium text-gray-700">
                              {item.quantity || 0}
                            </td>

                            <td className="px-4 py-4 text-right text-sm text-gray-700">
                              ₹{price.toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                              ₹{amount.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Description
              </h3>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {returnItem.description ||
                    "No additional description provided."}
                </p>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Return Timeline
              </h3>

              <div className="rounded-xl border border-gray-200">
                <div className="divide-y divide-gray-200">
                  <TimelineItem
                    label="Requested"
                    date={returnItem.requestedAt}
                    active
                  />

                  {isRejected ? (
                    <TimelineItem
                      label="Rejected"
                      date={returnItem.rejectedAt}
                      active={Boolean(returnItem.rejectedAt)}
                    />
                  ) : (
                    <>
                      <TimelineItem
                        label="Approved"
                        date={returnItem.approvedAt}
                        active={Boolean(returnItem.approvedAt)}
                      />

                      <TimelineItem
                        label="Picked Up"
                        date={returnItem.pickedUpAt}
                        active={Boolean(returnItem.pickedUpAt)}
                      />

                      <TimelineItem
                        label="Refunded"
                        date={returnItem.refundedAt}
                        active={Boolean(
                          returnItem.refundedAt ||
                            returnItem.refundStatus === "Processed",
                        )}
                      />

                      <TimelineItem
                        label="Completed"
                        date={returnItem.completedAt}
                        active={Boolean(
                          returnItem.completedAt ||
                            returnItem.status === "Completed",
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t bg-white px-6 py-4">
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

const TimelineItem = ({ label, date, active }) => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            active ? "bg-emerald-500" : "bg-gray-300"
          }`}
        />

        <span
          className={`text-sm font-medium ${
            active ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {label}
        </span>
      </div>

      <span className="text-xs text-gray-500">
        {date
          ? new Date(date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—"}
      </span>
    </div>
  );
};

export default ReturnDetailsModal;
