"use client";
import React from "react";
import { useGetTrialBalanceQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrialBalance() {
  const { data = [], isLoading, isError, refetch } = useGetTrialBalanceQuery();

  if (isLoading) return <p>Loading Trial Balance...</p>;
  if (isError) return <p>Error loading Trial Balance</p>;

  return (
    <Card className="space-y-2">
      <CardHeader>
        <CardTitle>Trial Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ul className="pl-4 list-disc space-y-1">
            {data.map((tb, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{tb.accountName}</span>
                <span>Debit: {tb.totalDebit.toLocaleString()} | Credit: {tb.totalCredit.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No trial balance data</p>
        )}
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
