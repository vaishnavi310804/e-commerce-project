import React from "react";

const filterOptions = [
  { id: "today", label: "Today" },
  { id: "7days", label: "Last 7 Days" },
  { id: "30days", label: "Last 30 Days" },
  { id: "90days", label: "Last 90 Days" },
  { id: "year", label: "This Year" },
  { id: "custom", label: "Custom Date Range" },
];

const DashboardFilters = ({
  activeFilter,
  onFilterChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyCustom,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-gray-100 p-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onFilterChange(opt.id)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
              activeFilter === opt.id
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {activeFilter === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500"
          />
          <button
            onClick={onApplyCustom}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;
