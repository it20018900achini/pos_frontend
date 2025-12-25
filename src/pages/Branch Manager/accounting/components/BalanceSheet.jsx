"use client";
import React from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function BalanceSheet() {
  const { data, isLoading, isError, refetch } = useGetBalanceSheetQuery();

  if (isLoading) return <p>Loading Balance Sheet...</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Balance Sheet</h2>

      {/* Assets */}
      <div>
        <h3 className="font-medium text-lg">Assets</h3>
        {data.assets.length > 0 ? (
          <ul className="pl-4 list-disc">
            {data.assets.map((item, idx) => (
              <li key={idx}>
                {item.account}: {item.balance.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No assets</p>
        )}
        <p className="font-semibold">Total Assets: {data.totalAssets.toLocaleString()}</p>
      </div>

      {/* Liabilities */}
      <div>
        <h3 className="font-medium text-lg">Liabilities</h3>
        {data.liabilities.length > 0 ? (
          <ul className="pl-4 list-disc">
            {data.liabilities.map((item, idx) => (
              <li key={idx}>
                {item.account}: {item.balance.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No liabilities</p>
        )}
        <p className="font-semibold">Total Liabilities: {data.totalLiabilities.toLocaleString()}</p>
      </div>

      {/* Equity */}
      <div>
        <h3 className="font-medium text-lg">Equity</h3>
        {data.equity.length > 0 ? (
          <ul className="pl-4 list-disc">
            {data.equity.map((item, idx) => (
              <li key={idx}>
                {item.account}: {item.balance.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No equity</p>
        )}
        <p className="font-semibold">Total Equity: {data.totalEquity.toLocaleString()}</p>
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
