"use client";
import React from "react";
import { useGetTrialBalanceQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function TrialBalance() {
  const { data = [], isLoading, isError, refetch } = useGetTrialBalanceQuery();

  if (isLoading) return <p>Loading Trial Balance...</p>;
  if (isError) return <p>Error loading Trial Balance</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Trial Balance</h2>

      <div className="border rounded-md p-2">
        <div className="grid grid-cols-3 font-semibold border-b pb-1">
          <span>Account</span>
          <span>Total Debit</span>
          <span>Total Credit</span>
        </div>

        {data.map((tb, idx) => (
          <div key={idx} className="grid grid-cols-3 border-b last:border-b-0 py-1">
            <span>{tb.accountName}</span>
            <span>{tb.totalDebit.toLocaleString()}</span>
            <span>{tb.totalCredit.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <button
        onClick={refetch}
        className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Refresh
      </button>
    </div>
  );
}
