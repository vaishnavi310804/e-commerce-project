import React from "react";
import SearchBar from "../common/SearchBar";
import { FaFileCsv, FaEyeSlash, FaEye, FaTrash } from "react-icons/fa";

const ReviewFilters = ({
  searchTerm,
  onSearchChange,
  ratingFilter,
  onRatingChange,
  statusFilter,
  onStatusChange,
  sortFilter,
  onSortChange,
  selectedCount = 0,
  onBulkHide,
  onBulkUnhide,
  onBulkDelete,
  onReset,
  onExportCSV,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Product, Customer Name, Review..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={ratingFilter}
            onChange={(e) => onRatingChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars (★★★★★)</option>
            <option value="4">4 Stars (★★★★☆)</option>
            <option value="3">3 Stars (★★★☆☆)</option>
            <option value="2">2 Stars (★★☆☆☆)</option>
            <option value="1">1 Star (★☆☆☆☆)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Statuses</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>

          <select
            value={sortFilter}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_rating">Highest Rating</option>
            <option value="lowest_rating">Lowest Rating</option>
          </select>

          {(searchTerm ||
            ratingFilter !== "all" ||
            statusFilter !== "all" ||
            sortFilter !== "newest") && (
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
          >
            <FaFileCsv size={16} /> Export CSV
          </button>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-2.5 text-sm text-indigo-900 border border-indigo-200">
          <span className="font-semibold">
            {selectedCount} review{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onBulkHide}
              className="flex items-center gap-1.5 rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
            >
              <FaEyeSlash /> Hide Selected
            </button>
            <button
              onClick={onBulkUnhide}
              className="flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <FaEye /> Unhide Selected
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 rounded bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
            >
              <FaTrash /> Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFilters;
