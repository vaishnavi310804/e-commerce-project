import React from "react";

const orderStatusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Placed: "bg-blue-50 text-blue-700 border-blue-200",
  Confirmed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Processing: "bg-purple-50 text-purple-700 border-purple-200",
  Packed: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Shipped: "bg-sky-50 text-sky-700 border-sky-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const paymentStatusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed: "bg-rose-50 text-rose-700 border-rose-200",
  Refunded: "bg-slate-100 text-slate-700 border-slate-300",
};

const StatusBadge = ({ type = "order", status }) => {
  const stylesMap = type === "payment" ? paymentStatusStyles : orderStatusStyles;
  const style = stylesMap[status] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
