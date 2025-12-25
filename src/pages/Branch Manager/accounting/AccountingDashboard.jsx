"use client";

import React, { useState } from "react";
import ExpenseCategoryTable from "./components/ExpenseCategoryTable";
import ExpenseTable from "./components/ExpenseTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useGetTotalExpensesPerCategoryQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function AccountingDashboard() {
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const { data: chartDataRaw, isLoading: chartLoading, refetch } =
    useGetTotalExpensesPerCategoryQuery(
      { from: filterFrom || undefined, to: filterTo || undefined },
      { skip: !filterFrom && !filterTo }
    );

  const chartData =
    chartDataRaw?.map(([category, total]) => ({
      name: category || "Unknown",
      value: total || 0,
    })) || [];

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ["#4f46e5", "#16a34a", "#f59e0b", "#dc2626", "#06b6d4", "#9333ea", "#f43f5e"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Accounting Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap items-center">
        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={() => refetch()}
          className="ml-2 bg-blue-500 text-white p-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Total Expenses */}
      <p className="mb-4 font-semibold">Total Expenses: {totalExpenses.toFixed(2)}</p>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border p-4 bg-white rounded shadow h-72">
          <h2 className="text-xl font-semibold mb-2">Expenses per Category (Bar)</h2>
          {chartLoading ? (
            <p>Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border p-4 bg-white rounded shadow h-72">
          <h2 className="text-xl font-semibold mb-2">Expenses per Category (Pie)</h2>
          {chartLoading ? (
            <p>Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Expenses per Category Table */}
      <div className="mb-8 border p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Expenses per Category</h2>
        {chartLoading ? (
          <p>Loading...</p>
        ) : chartData.length === 0 ? (
          <p>No data available for selected dates.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-right">{item.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Other Tables */}
      <div className="mb-8 border p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
        <ExpenseCategoryTable />
      </div>

      <div className="border p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
        <ExpenseTable />
      </div>
    </div>
  );
}
