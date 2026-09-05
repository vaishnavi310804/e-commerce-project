import React from "react";

const ToggleSwitch = ({
  id,
  checked,
  onChange,
  disabled = false,
  loading = false,
  label = "",
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (disabled || loading) return;
    onChange?.(!checked);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label || "Toggle module state"}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6547C9] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-emerald-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {loading && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#6547C9] border-t-transparent" />
          )}
        </span>
      </button>
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          checked ? "text-emerald-700" : "text-slate-500"
        }`}
      >
        {loading ? "Updating..." : checked ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
};

export default ToggleSwitch;
