import React, { useEffect, useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import { updateOrderStatus, updatePaymentStatus } from "../../services/orderApi";

const orderStatusOptions = [
  "Pending",
  "Placed",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const paymentStatusOptions = ["Pending", "Paid", "Failed", "Refunded"];

const OrderDetailsModal = ({ open, onClose, order, onSuccess }) => {
  const [currentOrderStatus, setCurrentOrderStatus] = useState("");
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (order) {
      setCurrentOrderStatus(order.orderStatus || "Pending");
      setCurrentPaymentStatus(order.paymentStatus || "Pending");
    }
  }, [order, open]);

  if (!open || !order) return null;

  const handleOrderStatusChange = async (newStatus) => {
    if (newStatus === "Cancelled") {
      setShowCancelConfirm(true);
      return;
    }
    await executeOrderStatusUpdate(newStatus);
  };

  const executeOrderStatusUpdate = async (newStatus) => {
    try {
      setUpdatingOrder(true);
      const res = await updateOrderStatus(order._id, newStatus);
      setCurrentOrderStatus(newStatus);
      setShowCancelConfirm(false);

      if (res?.data) {
        order.orderStatus = res.data.orderStatus;
        if (res.data.paymentStatus) {
          order.paymentStatus = res.data.paymentStatus;
          setCurrentPaymentStatus(res.data.paymentStatus);
        }
      }

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingOrder(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus) => {
    try {
      setUpdatingPayment(true);
      const res = await updatePaymentStatus(order._id, newStatus);
      setCurrentPaymentStatus(newStatus);

      if (res?.data) {
        order.paymentStatus = res.data.paymentStatus;
      }

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update payment status.");
    } finally {
      setUpdatingPayment(false);
    }
  };

  const productsList = order.products || order.items || [];
  const address = order.shippingAddress || order.address || {};
  const customerName =
    order.user?.fullName ||
    order.user?.name ||
    address.fullName ||
    "Guest Customer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Order Details - {order.orderNumber || order._id}
            </h2>
            <p className="text-xs text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Status Update Controls */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Update Order Status
              </label>
              <select
                value={currentOrderStatus}
                onChange={(e) => handleOrderStatusChange(e.target.value)}
                disabled={updatingOrder}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
              >
                {orderStatusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Update Payment Status
              </label>
              <select
                value={currentPaymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                disabled={updatingPayment}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
              >
                {paymentStatusOptions.map((pst) => (
                  <option key={pst} value={pst}>
                    {pst}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cancellation Confirmation Box */}
          {showCancelConfirm && (
            <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-xl text-rose-600" />
                <span className="text-sm font-medium">
                  Are you sure you want to cancel this order?
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={() => executeOrderStatusUpdate("Cancelled")}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          )}

          {/* Customer & Address Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer Info */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
                Customer Information
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">{customerName}</p>
                <p className="text-gray-600">{order.user?.email || "No email"}</p>
                <p className="text-gray-600">
                  {address.phoneNumber || order.user?.phoneNumber || "No phone"}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{address.fullName || customerName}</p>
                <p>{address.streetAddress || address.street || "N/A"}</p>
                <p>
                  {[address.city, address.state, address.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>{address.country || ""}</p>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
              Ordered Products ({productsList.length})
            </h3>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productsList.map((item, idx) => {
                    const prod = item.product || {};
                    const imgUrl = prod.productImage?.url || prod.image?.url;

                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={prod.name}
                                className="h-10 w-10 rounded-lg object-cover border"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                N/A
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {prod.name || "Product Item"}
                              </p>
                              {prod.brand && (
                                <p className="text-xs text-gray-500">{prod.brand}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right">
                          ${Number(item.price || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary & Status Breakdown */}
          <div className="flex flex-col justify-between gap-6 rounded-xl border border-gray-200 p-4 sm:flex-row">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payment Info
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Method:</span>
                <span className="font-semibold text-gray-800">
                  {order.paymentMethod || "COD"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <StatusBadge type="payment" status={currentPaymentStatus} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Order Status:</span>
                <StatusBadge type="order" status={currentOrderStatus} />
              </div>
            </div>

            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${Number(order.subtotal || order.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span>${Number(order.shippingCharge || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${Number(order.tax || 0).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-${Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-base text-gray-900">
                <span>Grand Total</span>
                <span>${Number(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
