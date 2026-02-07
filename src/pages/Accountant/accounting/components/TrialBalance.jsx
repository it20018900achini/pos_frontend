"use client";
import React from "react";
import { useGetTrialBalanceQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import ContentLayout from "../../../Dashboard/ContentLayout";

export default function TrialBalance() {
  const { data = [], isLoading, isError, refetch } = useGetTrialBalanceQuery();

  if (isLoading) return <p>Loading Trial Balance...</p>;
  if (isError) return <p>Error loading Trial Balance</p>;

  // Calculate totals
  const totalDebit = data.reduce((sum, tb) => sum + (tb.totalDebit || 0), 0);
  const totalCredit = data.reduce((sum, tb) => sum + (tb.totalCredit || 0), 0);
  const isBalanced = totalDebit === totalCredit;

  return (

    <ContentLayout title="Trial Balance" subTitle="View the summary of debits and credits for all accounts." >
     
      <div>
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
                  <td className="py-2 px-4 border-b text-right">{tb.totalDebit.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b text-right">{tb.totalCredit.toLocaleString()}</td>
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

        <button
          onClick={refetch}
          className="mt-3 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>
    </ContentLayout>
  );
}
