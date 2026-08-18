import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";

const RevenueChart = ({ data = [] }) => {
  return (
    <ChartCard title="Monthly Revenue Growth" subtitle="Revenue generated per month">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#797979" }} />
          <YAxis tick={{ fontSize: 12, fill: "#797979" }} />
          <Tooltip
            formatter={(val) => [`$${Number(val).toFixed(2)}`, "Revenue"]}
            contentStyle={{ backgroundColor: "#797979", borderRadius: "8px", color: "#fff", border: "none" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6547C9"
            strokeWidth={3}
            dot={{ r: 4, fill: "#6547C9" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default RevenueChart;
