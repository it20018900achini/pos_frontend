"use client";
import React, { useState } from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react"; // spinning loader icon

export default function BalanceSheet() {
  const { data, isLoading, isError, refetch, isFetching } = useGetBalanceSheetQuery();

  if (isLoading) return <p>Loading Balance Sheet...</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  const renderSection = (title, items, total, color) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length > 0 ? (
          <ul className="space-y-1">
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
        <div className="flex justify-between mt-2 font-semibold">
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
          onClick={() => refetch()}
          disabled={isFetching}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            isFetching
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isFetching && <Loader2 className="w-4 h-4 animate-spin" />}
          Refresh
        </button>
      </div>

      {renderSection("Assets", data.assets, data.totalAssets, "green")}
      {renderSection("Liabilities", data.liabilities, data.totalLiabilities, "red")}
      {renderSection("Equity", data.equity, data.totalEquity, "blue")}
    </div>
  );
}
