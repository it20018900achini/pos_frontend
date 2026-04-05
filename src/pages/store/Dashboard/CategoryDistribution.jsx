import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function CategoryDistribution() {
  const { salesByCategory } = useSelector((state) => state.storeAnalytics);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Sales by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={salesByCategory}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="totalSales"
            nameKey="categoryName"
          >
            {salesByCategory.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}