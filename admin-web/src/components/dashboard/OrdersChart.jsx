import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";

const OrdersChart = ({ data = [] }) => {
  return (
    <ChartCard title="Monthly Orders Volume" subtitle="Total orders processed per month">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            formatter={(val) => [`${val} orders`, "Orders"]}
            contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", border: "none" }}
          />
          <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default OrdersChart;
