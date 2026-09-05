import React from 'react'

const ConfirmationModel = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[360px] max-w-[90vw] p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={
              confirmButtonClass ||
              "px-5 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModel;
