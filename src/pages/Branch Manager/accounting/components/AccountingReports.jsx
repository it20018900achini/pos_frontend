import React from "react";
import { useGetTrialBalanceQuery, useGetProfitLossQuery, useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/apiSlice";

export default function AccountingReports() {
  const { data: trialBalance } = useGetTrialBalanceQuery();
  const { data: profitLoss } = useGetProfitLossQuery();
  const { data: balanceSheet } = useGetBalanceSheetQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Trial Balance</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(trialBalance, null, 2)}</pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Profit & Loss</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(profitLoss, null, 2)}</pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Balance Sheet</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(balanceSheet, null, 2)}</pre>
      </div>
    </div>
  );
}
