import React, { useState, useEffect } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import ConfirmationModel from "../common/ConfirmationModel";
import { sendPromotionalNotification } from "../../services/notificationApi";

const SendNotificationModal = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setMessage("");
      setErrorMsg("");
      setShowConfirmModal(false);
    }
  }, [open]);

  if (!open) return null;

  const trimmedTitle = title.trim();
  const trimmedMessage = message.trim();
  const isFormValid = trimmedTitle.length > 0 && trimmedMessage.length > 0;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    setErrorMsg("");
    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setErrorMsg("");

    try {
      const response = await sendPromotionalNotification({
        title: trimmedTitle,
        message: trimmedMessage,
      });

      const count = response?.data?.recipientsCount ?? response?.recipientsCount;
      const successMessage = count !== undefined
        ? `Promotional notification sent successfully to ${count} customer${count === 1 ? "" : "s"}.`
        : "Notification sent successfully.";

      setTitle("");
      setMessage("");
      onSuccess?.(successMessage);
    } catch (error) {
      console.error("Failed to send promotional notification:", error);
      const apiError =
        error.response?.data?.message ||
        error.message ||
        "Failed to send promotional notification. Please try again.";

      setErrorMsg(apiError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setTitle("");
    setMessage("");
    setErrorMsg("");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Send Promotional Notification
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Send a promotional notification to all customers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleFormSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="modal-notif-title" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Notification Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="modal-notif-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hurry! Big Sale!"
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#6547C9] focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="modal-notif-message" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Notification Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="modal-notif-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Get up to 50% off on selected products."
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#6547C9] focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValid || submitting}
                className="flex items-center gap-2 rounded-xl bg-[#6547C9] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={12} />
                    <span>Send to All Customers</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Step */}
      <ConfirmationModel
        isOpen={showConfirmModal}
        title="Send Notification?"
        message="Are you sure you want to send this notification to all customers?"
        confirmText="Send"
        cancelText="Cancel"
        confirmButtonClass="px-5 py-2 text-sm font-semibold rounded-lg bg-[#6547C9] text-white hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSend}
      />
    </>
  );
};

export default SendNotificationModal;
