import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const colorMap = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  sky: "bg-sky-50 text-sky-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
};

const StatCard = ({ title, value, growth, icon: Icon, color = "indigo", subText }) => {
  const isPositive = Number(growth) >= 0;
  const iconStyle = colorMap[color];

  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg p-2.5 ${iconStyle}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {growth !== undefined && growth !== null && (
          <span
            className={`flex items-center text-xs font-semibold ${
              isPositive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            {Math.abs(growth)}%
          </span>
        )}
      </div>

      {subText && (
        <p className="mt-1 text-xs text-slate-400 font-medium">{subText}</p>
      )}
    </div>
  );
};

export default StatCard;
