import React, { useState } from "react";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import { useFeatureToggle } from "../../context/FeatureContext";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import ConfirmationModel from "../../components/common/ConfirmationModel";
import DashboardLayout from "../../layouts/DashboardLayout";

const FeatureToggles = () => {
  const { togglesList, loading, refetchFeatures, setToggleState } =
    useFeatureToggle();
  const [updatingKey, setUpdatingKey] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null); // { toggle, targetState }

  const handleToggleClick = (toggle, nextState) => {
    setPendingToggle({ toggle, targetState: nextState });
  };

  const executeToggle = async (toggle, targetState) => {
    try {
      setUpdatingKey(toggle.key);

      await setToggleState(toggle.key, targetState);
    } catch (err) {
      console.error("Failed to update feature toggle:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update feature toggle status.";

      refetchFeatures();
    } finally {
      setUpdatingKey(null);
      setPendingToggle(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Module Dashboard
            </h1>
            <p className="mt-1 text-gray-500">
              Enable or disable Admin Web modules dynamically.
            </p>
          </div>
        </div>

        {loading && togglesList.length === 0 ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6547C9] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {togglesList.map((toggle) => {
              const isUpdating = updatingKey === toggle.key;
              const description =
                toggle.description || "Admin Web module";

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
                      {toggle.updatedAt && (
                        <p>
                          Updated:{" "}
                          {new Date(toggle.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <ToggleSwitch
                      id={`toggle-${toggle.key}`}
                      checked={toggle.isEnabled}
                      onChange={(nextState) =>
                        handleToggleClick(toggle, nextState)
                      }
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

        {pendingToggle && (
          <ConfirmationModel
            isOpen={!!pendingToggle}
            title={
              pendingToggle.targetState === false
                ? `Disable ${pendingToggle.toggle.name || pendingToggle.toggle.key}?`
                : `Enable ${pendingToggle.toggle.name || pendingToggle.toggle.key}?`
            }
            message={
              pendingToggle.targetState === false
                ? `Are you sure you want to disable the ${pendingToggle.toggle.name || pendingToggle.toggle.key} module? Admin users will receive a "Module Disabled" screen when accessing this module.`
                : `Are you sure you want to enable the ${pendingToggle.toggle.name || pendingToggle.toggle.key} module?`
            }
            confirmText={pendingToggle.targetState === false ? "Disable" : "Enable"}
            confirmButtonClass={
              pendingToggle.targetState === false
                ? "px-5 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                : "px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            }
            onCancel={() => setPendingToggle(null)}
            onConfirm={() =>
              executeToggle(pendingToggle.toggle, pendingToggle.targetState)
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default FeatureToggles;
