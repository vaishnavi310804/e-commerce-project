import React, { useState } from "react";
import { FaSlidersH, FaShieldAlt, FaSync, FaExclamationTriangle, FaCheckCircle, FaBan } from "react-icons/fa";
import { useFeatureToggle } from "../../context/FeatureContext";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import ConfirmationModel from "../../components/common/ConfirmationModel";

const MODULE_DESCRIPTIONS = {
  PRODUCTS: "Controls Product catalog management and product listing screens in Admin Web.",
  CATEGORIES: "Controls Category hierarchy management in Admin Web.",
  ORDERS: "Controls Order processing, fulfillment, and status updates in Admin Web.",
  REVIEWS: "Controls Customer product review moderation and management in Admin Web.",
  TICKETS: "Controls Customer Support Ticket handling and assignment in Admin Web.",
  RETURNS: "Controls Return and Exchange request processing in Admin Web.",
  SHIPMENTS: "Controls Shipment dispatch and tracking management in Admin Web.",
  REFUNDS: "Controls Customer refund issuing and tracking in Admin Web.",
  CUSTOMER_LOGS: "Controls Customer action audit log inspection in Admin Web.",
  CUSTOMERS: "Controls Customer account management and blocking in Admin Web.",
};

const FeatureToggles = () => {
  const { togglesList, loading, refetchFeatures, setToggleState } = useFeatureToggle();
  const [updatingKey, setUpdatingKey] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null); // { toggle, targetState }
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message }

  const handleToggleClick = (toggle, nextState) => {
    if (nextState === false) {
      // Prompt confirmation before disabling an active module
      setPendingToggle({ toggle, targetState: nextState });
    } else {
      executeToggle(toggle, nextState);
    }
  };

  const executeToggle = async (toggle, targetState) => {
    try {
      setUpdatingKey(toggle.key);
      setFeedback(null);

      await setToggleState(toggle.key, targetState, toggle.version);

      setFeedback({
        type: "success",
        message: `Module '${toggle.name || toggle.key}' has been ${targetState ? "enabled" : "disabled"} successfully.`,
      });
    } catch (err) {
      console.error("Failed to update feature toggle:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update feature toggle status.";

      setFeedback({
        type: "error",
        message: errMsg,
      });

      // Refetch feature toggles in case of version conflict
      refetchFeatures();
    } finally {
      setUpdatingKey(null);
      setPendingToggle(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#F0EEFF] text-[#6547C9] rounded-xl shadow-sm">
            <FaSlidersH className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">
                Module Dashboard / Feature Toggles
              </h1>
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-[#6547C9] border border-purple-200">
                <FaShieldAlt size={10} /> Super Admin Only
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enable or disable Admin Web modules dynamically. Disabling a module restricts Admin access while preserving customer mobile functionality.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refetchFeatures}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 disabled:opacity-50"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          <span>Refresh States</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <FaCheckCircle className="text-emerald-600" />
            ) : (
              <FaExclamationTriangle className="text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Module Cards Grid */}
      {loading && togglesList.length === 0 ? (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6547C9] border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {togglesList.map((toggle) => {
            const isUpdating = updatingKey === toggle.key;
            const description =
              toggle.description || MODULE_DESCRIPTIONS[toggle.key] || "Admin Web module";

            return (
              <div
                key={toggle.key}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  toggle.isEnabled
                    ? "border-slate-200"
                    : "border-amber-200 bg-amber-50/20"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">
                        {toggle.name || toggle.key}
                      </h3>
                      <span className="inline-block mt-0.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {toggle.key}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        toggle.isEnabled
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {toggle.isEnabled ? (
                        <>
                          <FaCheckCircle size={10} /> Active
                        </>
                      ) : (
                        <>
                          <FaBan size={10} /> Disabled
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    <p>Version: v{toggle.version || 1}</p>
                    {toggle.updatedAt && (
                      <p>Updated: {new Date(toggle.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>

                  <ToggleSwitch
                    id={`toggle-${toggle.key}`}
                    checked={toggle.isEnabled}
                    onChange={(nextState) => handleToggleClick(toggle, nextState)}
                    loading={isUpdating}
                    disabled={isUpdating}
                    label={`Toggle ${toggle.name}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disablement Confirmation Modal */}
      {pendingToggle && (
        <ConfirmationModel
          isOpen={!!pendingToggle}
          title={`Disable ${pendingToggle.toggle.name || pendingToggle.toggle.key}?`}
          message={`Are you sure you want to disable the ${pendingToggle.toggle.name || pendingToggle.toggle.key} module? Admin users will receive a "Module Disabled" screen when accessing this module.`}
          onCancel={() => setPendingToggle(null)}
          onConfirm={() => executeToggle(pendingToggle.toggle, false)}
        />
      )}
    </div>
  );
};

export default FeatureToggles;
