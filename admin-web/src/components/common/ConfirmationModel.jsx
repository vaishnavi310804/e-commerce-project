import React from 'react'

const ConfirmationModel = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
     if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">

        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="text-slate-500 mt-3">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationModel;
