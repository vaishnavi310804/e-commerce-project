import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";

const CustomerGrowthChart = ({ data = [] }) => {
  return (
    <ChartCard title="Customer Growth" subtitle="New customer signups per month">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            formatter={(val) => [`${val} customers`, "New Customers"]}
            contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", border: "none" }}
          />
          <Area
            type="monotone"
            dataKey="customers"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorCustomers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default CustomerGrowthChart;
