import React from "react";
import SearchBar from "../common/SearchBar";
import { FaFileCsv } from "react-icons/fa";

const CustomerFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortFilter,
  onSortChange,
  onReset,
  onExportCSV,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <SearchBar
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer by Name, Email, Phone..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

        <select
          value={sortFilter}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="spending">Highest Spending</option>
          <option value="orders">Most Orders</option>
        </select>

        {(searchTerm || statusFilter !== "all" || sortFilter !== "newest") && (
          <button
            onClick={onReset}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Reset
          </button>
        )}

        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          title="Export CSV"
        >
          <FaFileCsv size={16} /> Export CSV
        </button>
      </div>
    </div>
  );
};

export default CustomerFilters;
