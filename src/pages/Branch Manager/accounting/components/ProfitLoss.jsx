"use client";
import React from "react";
import { useGetProfitLossQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfitLoss() {
  const { data, isLoading, isError, refetch } = useGetProfitLossQuery();

  const revenue = data?.totalIncome ?? 0;
  const expenses = data?.totalExpense ?? 0;
  const netProfit = data?.netProfit ?? 0;

  if (isLoading) return <p>Loading Profit & Loss...</p>;
  if (isError) return <p>Error loading Profit & Loss</p>;

  return (
    <Card className="space-y-2">
      <CardHeader>
        <CardTitle>Profit & Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between"><span>Revenue:</span><span>{revenue.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Expenses:</span><span>{expenses.toLocaleString()}</span></div>
        <div className="flex justify-between font-semibold"><span>Net Profit:</span><span>{netProfit.toLocaleString()}</span></div>
        <button
          onClick={refetch}
          className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </CardContent>
    </Card>
  );
}
