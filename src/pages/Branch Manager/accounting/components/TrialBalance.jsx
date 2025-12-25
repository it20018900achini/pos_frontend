"use client";
import React from "react";
import { useGetTrialBalanceQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function TrialBalance() {
  const { data, isLoading, isError, refetch } = useGetTrialBalanceQuery();

  if (isLoading) return <p>Loading Trial Balance...</p>;
  if (isError) return <p>Error loading Trial Balance</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Trial Balance</h2>
      <ul>
        {data?.map(tb => (
          <li key={tb.accountCode}>{tb.accountName}: {tb.balance}</li>
        ))}
      </ul>
      <button onClick={refetch} className="mt-2 px-2 py-1 bg-gray-200 rounded">Refresh</button>
    </div>
  );
}
