import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({
  title,
  value,
  growth,
  icon: Icon,
  subText,
}) => {
  const isPositive = Number(growth) >= 0;

  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>

        {Icon && (
          <div className="rounded-lg bg-indigo-50 p-2.5 text-[#6547C9]">
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
            {isPositive ? (
              <FaArrowUp className="mr-1" />
            ) : (
              <FaArrowDown className="mr-1" />
            )}
            {Math.abs(growth)}%
          </span>
        )}
      </div>

      {subText && (
        <p className="mt-1 text-xs font-medium text-slate-400">
          {subText}
        </p>
      )}
    </div>
  );
};

export default StatCard;
