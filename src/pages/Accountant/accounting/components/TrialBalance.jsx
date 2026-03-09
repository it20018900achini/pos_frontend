"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetTrialBalanceQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import ContentLayout from "../../../Dashboard/ContentLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TrialBalance() {
  const { selectedBranchId } = useSelector((state) => state.user);

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

  const { data = [], isLoading, isError, refetch } = useGetTrialBalanceQuery({
    branchId: selectedBranchId,
    start,
    end,
  });

  // Calculate totals
  const totalDebit = data.reduce((sum, tb) => sum + (tb.totalDebit || 0), 0);
  const totalCredit = data.reduce((sum, tb) => sum + (tb.totalCredit || 0), 0);
  const isBalanced = totalDebit === totalCredit;

  if (isError) return <p>Error loading Trial Balance</p>;

  return (
    <ContentLayout
      title="Trial Balance"
      loadingSpinner={isLoading}
      subTitle="Summary of debits and credits by account"
    >
      {/* Date Inputs */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <label className="flex items-center gap-2">
          Start:
          <Input
            type="date"
            value={start.slice(0, 10)}
            onChange={(e) => {
              const d = new Date(e.target.value);
              d.setHours(0, 0, 0, 0);
              setStart(d.toISOString());
            }}
          />
        </label>
        <label className="flex items-center gap-2">
          End:
          <Input
            type="date"
            value={end.slice(0, 10)}
            onChange={(e) => {
              const d = new Date(e.target.value);
              d.setHours(23, 59, 59, 999);
              setEnd(d.toISOString());
            }}
          />
        </label>
        <Button onClick={refetch} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Trial Balance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Account Name</th>
              <th className="py-2 px-4 border-b text-right">Debit</th>
              <th className="py-2 px-4 border-b text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tb, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{tb.accountName}</td>
                <td className="py-2 px-4 border-b text-right">{(tb.totalDebit || 0).toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{(tb.totalCredit || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={isBalanced ? "bg-green-100 font-semibold" : "bg-red-100 font-semibold"}>
              <td className="py-2 px-4 border-t">Total</td>
              <td className="py-2 px-4 border-t text-right">{totalDebit.toLocaleString()}</td>
              <td className="py-2 px-4 border-t text-right">{totalCredit.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </ContentLayout>
  );
}