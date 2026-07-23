import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const colorClasses = {
  indigo: {
    border: "border-indigo-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  emerald: {
    border: "border-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  amber: {
    border: "border-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  rose: {
    border: "border-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  sky: {
    border: "border-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
};

const StatCard = ({ title, value, growth, icon: Icon, color = "indigo", subText = "vs previous period" }) => {
  const isPositive = Number(growth) >= 0;
  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <div className={`flex flex-col justify-between rounded-xl bg-white p-5 shadow transition hover:shadow-lg border-l-4 ${colors.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg p-2.5 ${colors.bg} ${colors.text}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>

      {growth !== undefined && growth !== null && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
              isPositive
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
            {Math.abs(growth)}%
          </span>
          <span className="text-gray-400">{subText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
