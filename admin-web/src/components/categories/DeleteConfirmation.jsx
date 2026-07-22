import React from 'react'

const DeleteConfirmation = ({
  open,
  category,
  loading,
  onClose,
  onConfirm,
}) => {
    if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">
          Delete Category
        </h2>

        <p className="mt-4 text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {category?.name}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-red-500">
          This category will be marked as inactive.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation
