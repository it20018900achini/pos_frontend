"use client";
import React from "react";
import { useGetProfitLossQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function ProfitLoss() {
  const { data, isLoading, isError, refetch } = useGetProfitLossQuery();

  if (isLoading) return <p>Loading Profit & Loss...</p>;
  if (isError) return <p>Error loading Profit & Loss</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold mb-2">Profit & Loss</h2>

      <div className="flex justify-between border-b pb-1">
        <span>Total Income:</span>
        <span>{data.totalIncome.toLocaleString()}</span>
      </div>

      <div className="flex justify-between border-b pb-1">
        <span>Total Expense:</span>
        <span>{data.totalExpense.toLocaleString()}</span>
      </div>

      <div className="flex justify-between font-semibold pt-1">
        <span>Net Profit:</span>
        <span
          className={data.netProfit < 0 ? "text-red-600" : "text-green-600"}
        >
          {data.netProfit.toLocaleString()}
        </span>
      </div>

      <button
        onClick={refetch}
        className="mt-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Refresh
      </button>
    </div>
  );
}
