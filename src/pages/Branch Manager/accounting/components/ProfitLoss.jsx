"use client";
import React, { useState, useMemo } from "react";
import { useGetProfitLossQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function ProfitLossReport() {
  const today = new Date();

  const defaultStart = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
    [today]
  );
  const defaultEnd = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    [today]
  );

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  const { data: report, isLoading, isError, refetch } = useGetProfitLossQuery({ start, end });

  if (isLoading) return <p>Loading Profit & Loss...</p>;
  if (isError) return <p>Error loading report.</p>;

  // Group accounts by type
  const incomes = report?.incomes || [];
  const expenses = report?.expenses || [];

  const totalIncome = incomes.reduce((sum, acc) => sum + acc.credit - acc.debit, 0);
  const totalExpense = expenses.reduce((sum, acc) => sum + acc.debit - acc.credit, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>

      {/* Date Inputs */}
      <div className="flex gap-2 items-center mb-4">
        <label>
          Start:
          <Input
            type="date"
            value={format(new Date(start), "yyyy-MM-dd")}
            onChange={(e) => {
              const d = new Date(e.target.value);
              d.setHours(0, 0, 0, 0);
              setStart(d.toISOString());
            }}
            className="ml-2"
          />
        </label>
        <label>
          End:
          <Input
            type="date"
            value={format(new Date(end), "yyyy-MM-dd")}
            onChange={(e) => {
              const d = new Date(e.target.value);
              d.setHours(23, 59, 59, 999);
              setEnd(d.toISOString());
            }}
            className="ml-2"
          />
        </label>
        <Button onClick={refetch} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Statement Table */}
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Account</th>
                <th className="border border-gray-300 p-2 text-left">Code</th>
                <th className="border border-gray-300 p-2 text-right">Debit</th>
                <th className="border border-gray-300 p-2 text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              {/* Income Section */}
              <tr className="bg-gray-200 font-bold">
                <td colSpan={4}>INCOME</td>
              </tr>
              {incomes.map((acc, idx) => (
                <tr key={acc.accountCode} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 p-2">{acc.accountName}</td>
                  <td className="border border-gray-300 p-2">{acc.accountCode}</td>
                  <td className="border border-gray-300 p-2 text-right">0.00</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {acc.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan={2} className="text-right border border-gray-300 p-2">Total Income</td>
                <td className="border border-gray-300 p-2 text-right">0.00</td>
                <td className="border border-gray-300 p-2 text-right">
                  {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Expense Section */}
              <tr className="bg-gray-200 font-bold">
                <td colSpan={4}>EXPENSES</td>
              </tr>
              {expenses.map((acc, idx) => (
                <tr key={acc.accountCode} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 p-2">{acc.accountName}</td>
                  <td className="border border-gray-300 p-2">{acc.accountCode}</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {acc.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">0.00</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan={2} className="text-right border border-gray-300 p-2">Total Expenses</td>
                <td className="border border-gray-300 p-2 text-right">
                  {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-300 p-2 text-right">0.00</td>
              </tr>

              {/* Net Profit/Loss */}
              <tr className="font-bold bg-gray-300">
                <td colSpan={2} className="text-right border border-gray-300 p-2">Net Profit / Loss</td>
                <td colSpan={2} className="border border-gray-300 p-2 text-right">
                  {netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
