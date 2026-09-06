import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ConfirmationModel from "../../components/common/ConfirmationModel";
import { sendPromotionalNotification } from "../../services/notificationApi";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Notifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }

  const trimmedTitle = title.trim();
  const trimmedMessage = message.trim();
  const isFormValid = trimmedTitle.length > 0 && trimmedMessage.length > 0;

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setFeedback(null);
    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setFeedback(null);

    try {
      const response = await sendPromotionalNotification({
        title: trimmedTitle,
        message: trimmedMessage,
      });

      const count = response?.data?.recipientsCount ?? response?.recipientsCount;
      const successText = count !== undefined
        ? `Promotional notification sent successfully to ${count} customer${count === 1 ? "" : "s"}.`
        : response?.message || "Notification sent successfully.";

      setFeedback({
        type: "success",
        text: successText,
      });

      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Failed to send promotional notification:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to send promotional notification. Please try again.";

      setFeedback({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Send promotional notifications to all customers.
          </p>
        </div>

        {/* Feedback Alert Banners */}
        {feedback && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <FaCheckCircle className="text-emerald-600 shrink-0 text-base" />
            ) : (
              <FaExclamationCircle className="text-red-600 shrink-0 text-base" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Promotional Notification Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleOpenConfirm} className="space-y-5">
            <div>
              <label htmlFor="notif-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Notification Title <span className="text-red-500">*</span>
              </label>
              <input
                id="notif-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekend Sale!"
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6547C9] focus:border-transparent text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 transition"
              />
            </div>

            <div>
              <label htmlFor="notif-message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Notification Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="notif-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Get up to 50% off on selected products this weekend."
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6547C9] focus:border-transparent text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 transition resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6547C9] text-white font-semibold text-sm hover:bg-[#5235ab] active:bg-[#432b8c] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    <span>Send to All Customers</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModel
        isOpen={showConfirmModal}
        title="Send Notification?"
        message="Are you sure you want to send this notification to all customers?"
        confirmText="Send"
        cancelText="Cancel"
        confirmButtonClass="px-5 py-2 text-sm font-semibold rounded-lg bg-[#6547C9] text-white hover:bg-[#5235ab] transition-colors shadow-sm cursor-pointer"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSend}
      />
    </DashboardLayout>
  );
};

export default Notifications;
