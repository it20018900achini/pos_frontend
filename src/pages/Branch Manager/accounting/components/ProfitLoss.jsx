"use client";
import React from "react";
import { useGetProfitLossQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function ProfitLoss() {
  const { data, isLoading, isError, refetch } = useGetProfitLossQuery();

  if (isLoading) return <p>Loading Profit & Loss...</p>;
  if (isError) return <p>Error loading Profit & Loss</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Profit & Loss</h2>
      <p>Revenue: {data?.revenue}</p>
      <p>Expenses: {data?.expenses}</p>
      <p>Net Profit: {data?.netProfit}</p>
      <button onClick={refetch} className="mt-2 px-2 py-1 bg-gray-200 rounded">Refresh</button>
    </div>
  );
}
