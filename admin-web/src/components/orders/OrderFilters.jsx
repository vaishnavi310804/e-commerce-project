import React from "react";
import SearchBar from "../common/SearchBar";

const OrderFilters = ({
  searchTerm,
  onSearchChange,
  orderStatus,
  onOrderStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  dateFilter,
  onDateFilterChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <SearchBar
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order ID, Customer Name..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Order Status Dropdown */}
        <select
          value={orderStatus}
          onChange={(e) => onOrderStatusChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="All">All Order Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Payment Status Dropdown */}
        <select
          value={paymentStatus}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="All">All Payment Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />

        {/* Reset Filter Button */}
        {(searchTerm || orderStatus !== "All" || paymentStatus !== "All" || dateFilter) && (
          <button
            onClick={onReset}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderFilters;
