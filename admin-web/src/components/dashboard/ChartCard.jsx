import React from "react";

const ChartCard = ({ title, subtitle, children, action }) => {
  return (
    <div className="flex flex-col rounded-xl bg-white p-5 shadow transition hover:shadow-lg">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 w-full min-h-[300px]">{children}</div>
    </div>
  );
};

export default ChartCard;
