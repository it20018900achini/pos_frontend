"use client";
import React from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function BalanceSheet() {
  const { data, isLoading, isError, refetch } = useGetBalanceSheetQuery();

  if (isLoading) return <p>Loading Balance Sheet...</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Balance Sheet</h2>
      <p>Assets: {data?.assets}</p>
      <p>Liabilities: {data?.liabilities}</p>
      <p>Equity: {data?.equity}</p>
      <button onClick={refetch} className="mt-2 px-2 py-1 bg-gray-200 rounded">Refresh</button>
    </div>
  );
}
