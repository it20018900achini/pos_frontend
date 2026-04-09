import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesTrendChart() {
  // 1. Pull the raw data from Redux
  const { monthlySales } = useSelector((state) => state.storeAnalytics);

  // 2. Transform the data for Recharts
  // Recharts needs consistent keys for dataKey mapping
  const chartData = useMemo(() => {
    if (!monthlySales) return [];

    return monthlySales.map((item) => ({
      // Format: "2026-01-01..." -> "Jan"
      month: new Date(item.timestamp).toLocaleString("default", { month: "short" }),
      // Keep the raw value for the graph
      amount: item.totalAmount,
    }));
  }, [monthlySales]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] w-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Growth</h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="month" // Matches the key from our useMemo mapping
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`} // Adds '$' to Y-axis numbers
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
            />

            <Area
              type="monotone"
              dataKey="amount" // Matches the key from our useMemo mapping
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}