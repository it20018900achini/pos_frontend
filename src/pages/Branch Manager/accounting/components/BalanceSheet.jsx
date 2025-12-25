"use client";
import React from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BalanceSheet() {
  const { data, isLoading, isError, refetch } = useGetBalanceSheetQuery();

  const assets = data?.assets || [];
  const liabilities = data?.liabilities || [];
  const equity = data?.equity || [];

  const totalAssets = data?.totalAssets ?? 0;
  const totalLiabilities = data?.totalLiabilities ?? 0;
  const totalEquity = data?.totalEquity ?? 0;

  if (isLoading) return <p>Loading Balance Sheet...</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  const renderSection = (title, items, total, color) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.length > 0 ? (
          <ul className="pl-4 list-disc">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.account}</span>
                <span>{item.balance.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No {title.toLowerCase()}</p>
        )}
        <div className="flex justify-between font-semibold mt-2">
          <span>Total {title}:</span>
          <Badge variant="outline" className={`border-${color}-500 text-${color}-600`}>
            {total.toLocaleString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Balance Sheet</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {renderSection("Assets", assets, totalAssets, "green")}
      {renderSection("Liabilities", liabilities, totalLiabilities, "red")}
      {renderSection("Equity", equity, totalEquity, "blue")}
    </div>
  );
}
