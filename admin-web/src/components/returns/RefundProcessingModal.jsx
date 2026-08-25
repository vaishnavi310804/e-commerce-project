import React, { useMemo, useState, useEffect } from "react";
import {
  FaTimes,
  FaRupeeSign,
  FaUser,
  FaBox,
  FaCreditCard,
  FaExclamationTriangle,
  FaUniversity,
  FaQrcode,
} from "react-icons/fa";

const RefundProcessingModal = ({
  open,
  returnItem,
  onClose,
  onConfirm,
  processing = false,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmed(false);
    }
  }, [open, returnItem]);

  const getProductId = (product) => {
    if (!product) return null;

    if (typeof product === "object") {
      return product._id;
    }

    return product;
  };

  const getOrderItem = (returnProduct) => {
    const returnedProductId = getProductId(returnProduct?.product);

    return returnItem?.order?.products?.find((orderItem) => {
      const orderProductId = getProductId(orderItem?.product);

      return (
        returnedProductId &&
        orderProductId &&
        String(returnedProductId) === String(orderProductId)
      );
    });
  };

  const refundAmount = useMemo(() => {
    if (!returnItem?.items?.length || !returnItem?.order?.products?.length) {
      return 0;
    }

    return returnItem.items.reduce((total, returnProduct) => {
      const orderItem = getOrderItem(returnProduct);

      if (!orderItem) {
        return total;
      }

      const price = Number(orderItem.price || 0);
      const quantity = Number(returnProduct.quantity || 0);

      return total + price * quantity;
    }, 0);
  }, [returnItem]);

  if (!open || !returnItem) return null;

  const customerName =
    returnItem.user?.fullName ||
    returnItem.order?.shippingAddress?.fullName ||
    "—";

  const orderNumber = returnItem.order?.orderNumber || "—";

  const paymentMethod = returnItem.order?.paymentMethod || "—";

  const paymentStatus = returnItem.order?.paymentStatus || "—";

  const isCod = paymentMethod === "COD";

  const bankDetails = returnItem.bankDetails || {};
  const upiId = bankDetails.upiId;
  const accountHolderName = bankDetails.accountHolderName;
  const accountNumber = bankDetails.accountNumber;
  const ifscCode = bankDetails.ifscCode;
  const bankName = bankDetails.bankName;

  const maskAccountNumber = (acc) => {
    if (!acc) return "—";
    const str = String(acc).trim();
    if (str.length <= 4) return str;
    return "*".repeat(str.length - 4) + str.slice(-4);
  };

  const handleClose = () => {
    if (processing) return;

    setConfirmed(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!confirmed || processing) return;

    onConfirm?.(returnItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Process Refund
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review the refund details before processing.
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

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  <FaUser size={14} />
                  <span className="text-xs font-semibold">Customer</span>
                </div>

                <p className="font-semibold text-gray-800">{customerName}</p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  <FaBox size={14} />
                  <span className="text-xs font-semibold">Order</span>
                </div>

                <p className="font-semibold text-gray-800">{orderNumber}</p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  <FaCreditCard size={14} />
                  <span className="text-xs font-semibold">Payment Method</span>
                </div>

                <p className="font-semibold text-gray-800">{paymentMethod}</p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  <FaCreditCard size={14} />
                  <span className="text-xs font-semibold">Payment Status</span>
                </div>

                <p className="font-semibold text-gray-800">{paymentStatus}</p>
              </div>
            </div>

            {isCod && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-indigo-900">
                  {upiId ? <FaQrcode size={16} /> : <FaUniversity size={16} />}
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Customer Refund Destination ({upiId ? "UPI" : "Bank Transfer"})
                  </span>
                </div>

                {upiId ? (
                  <div className="rounded-lg bg-white p-3 border border-indigo-100">
                    <p className="text-xs text-gray-500 font-medium">UPI ID</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5 select-all">
                      {upiId}
                    </p>
                  </div>
                ) : accountNumber ? (
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-white p-3 border border-indigo-100">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Account Holder
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {accountHolderName || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Account Number
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {maskAccountNumber(accountNumber)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        IFSC Code
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5 uppercase">
                        {ifscCode || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Bank Name
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {bankName || "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white p-3 border border-amber-200 text-amber-700 text-xs font-medium">
                    No customer bank/UPI destination details found for this COD return.
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Returned Products
              </h3>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                {returnItem.items?.map((item, index) => {
                  const product = item.product;
                  const orderItem = getOrderItem(item);

                  const itemPrice = Number(orderItem?.price || 0);
                  const itemAmount = itemPrice * Number(item.quantity || 0);

                  return (
                    <div
                      key={`${product?._id || index}-${index}`}
                      className="flex items-center justify-between gap-4 border-b border-gray-100 p-4 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-800">
                          {product?.name || "Product"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          ₹{itemPrice.toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold text-gray-800">
                        ₹{itemAmount.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm font-medium text-green-700">
                Refund Amount
              </p>

              <div className="mt-1 flex items-center gap-1 text-3xl font-bold text-emerald-700">
                <FaRupeeSign size={24} />
                {refundAmount.toFixed(2)}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <FaExclamationTriangle className="mt-0.5 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Refund Confirmation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Verify the customer's refund details before processing.
                  </p>
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={processing}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />

              <span className="text-sm text-gray-700">
                I have reviewed the return details properly and confirm that the
                refund should be processed.
              </span>
            </label>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 bg-white px-6 py-4 border-t border-gray-100">
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
            onClick={handleConfirm}
            disabled={!confirmed || processing || refundAmount <= 0}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Processing..." : "Process Refund"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundProcessingModal;
