import React from "react";
import { FaBan, FaCheckCircle, FaTimes } from "react-icons/fa";

const BlockConfirmModal = ({ open, onClose, customer, onConfirm, loading }) => {
  if (!open || !customer) return null;

  const isBlocking = customer.isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            {isBlocking ? (
              <div className="rounded-full bg-rose-100 p-2 text-rose-600">
                <FaBan size={20} />
              </div>
            ) : (
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                <FaCheckCircle size={20} />
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-800">
              {isBlocking ? "Block Customer" : "Unblock Customer"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="py-5 text-sm text-gray-600">
          <p>
            Are you sure you want to {isBlocking ? "block" : "unblock"}{" "}
            <span className="font-semibold text-gray-900">
              {customer.fullName}
            </span>
            ? ({customer.email})
          </p>
          <p className="mt-2 text-xs text-gray-500">
            {isBlocking
              ? "Blocking this customer will prevent them from logging in or placing new orders."
              : "Unblocking this customer will restore their account access."}
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
              isBlocking
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            } disabled:opacity-50`}
          >
            {loading
              ? isBlocking
                ? "Blocking..."
                : "Unblocking..."
              : isBlocking
              ? "Yes, Block"
              : "Yes, Unblock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockConfirmModal;
