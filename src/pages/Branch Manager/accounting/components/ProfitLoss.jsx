"use client";
import React from "react";
import { useGetProfitLossQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfitLoss() {
  const { data, isLoading, isError, refetch } = useGetProfitLossQuery();

  if (isLoading) return <p>Loading Profit & Loss...</p>;
  if (isError) return <p>Error loading Profit & Loss</p>;

  const { income = [], expenses = [], totalIncome = 0, totalExpense = 0, netProfit = 0 } = data;

  const renderList = (items) =>
    items.map((item) => (
      <div key={item.id} className="flex justify-between pl-4">
        <span>{item.name}</span>
        <Badge variant="outline" className="border-gray-300 text-gray-700">
          {item.amount?.toLocaleString() ?? 0}
        </Badge>
      </div>
    ));

  return (
    <div className="space-y-4">
      <Card className="space-y-2">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {income.length > 0 ? renderList(income) : <p className="text-gray-500">No income</p>}
          <div className="flex justify-between font-semibold mt-2">
            <span>Total Revenue:</span>
            <Badge variant="outline" className="border-teal-500 text-teal-600">
              {totalIncome.toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="space-y-2">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {expenses.length > 0 ? renderList(expenses) : <p className="text-gray-500">No expenses</p>}
          <div className="flex justify-between font-semibold mt-2">
            <span>Total Expenses:</span>
            <Badge variant="outline" className="border-orange-500 text-orange-600">
              {totalExpense.toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Profit</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between font-semibold">
          <span>Net Profit:</span>
          <Badge variant="outline" className="border-green-500 text-green-600">
            {netProfit.toLocaleString()}
          </Badge>
        </CardContent>
      </Card>

      <button
        onClick={refetch}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Refresh
      </button>
    </div>
  );
}
