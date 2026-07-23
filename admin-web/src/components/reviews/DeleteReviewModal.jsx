import React from "react";
import { FaTrash, FaTimes } from "react-icons/fa";

const DeleteReviewModal = ({
  open,
  onClose,
  review,
  isBulk = false,
  bulkCount = 0,
  onConfirm,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-100 p-2 text-rose-600">
              <FaTrash size={18} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isBulk ? "Delete Selected Reviews" : "Delete Review"}
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
          {isBulk ? (
            <p>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-gray-900">
                {bulkCount}
              </span>{" "}
              selected review{bulkCount > 1 ? "s" : ""}? This action cannot be undone.
            </p>
          ) : (
            <p>
              Are you sure you want to permanently delete the review for{" "}
              <span className="font-semibold text-gray-900">
                {review?.product?.name || "this product"}
              </span>{" "}
              by{" "}
              <span className="font-semibold text-gray-900">
                {review?.user?.fullName || review?.user?.name || "this customer"}
              </span>
              ?
            </p>
          )}
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
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
