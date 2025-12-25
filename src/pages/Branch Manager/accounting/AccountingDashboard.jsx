"use client";
import React from "react";
import TrialBalance from "./components/TrialBalance";
import ProfitLoss from "./components/ProfitLoss";
import BalanceSheet from "./components/BalanceSheet";
import ExpenseReport from "./components/ExpenseReport";
import ChartOfAccounts from "./components/ChartOfAccounts";

export default function AccountingDashboard() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Accounting Dashboard</h1>
      <ChartOfAccounts />
      <TrialBalance />
      <ProfitLoss />
      <BalanceSheet />
      <ExpenseReport />
    </div>
  );
}


// // src/pages/AccountingDashboard.jsx
// "use client";

// import React, { useState } from "react";
// import {
//   useGetChartOfAccountsQuery,
//   useGetTrialBalanceQuery,
//   useGetProfitLossQuery,
//   useGetBalanceSheetQuery,
//   useGetExpensesQuery,
// } from "@/ReduxToolkit/features/accounting/accountingApi";

// export default function AccountingDashboard() {
//   const { data: chartOfAccounts } = useGetChartOfAccountsQuery();
//   const { data: trialBalance } = useGetTrialBalanceQuery();
//   const { data: profitLoss } = useGetProfitLossQuery();
//   const { data: balanceSheet } = useGetBalanceSheetQuery();

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [fetchExpenses, setFetchExpenses] = useState(false);

//   const { data: expenses } = useGetExpensesQuery(
//     { from: fromDate, to: toDate },
//     { skip: !fetchExpenses }
//   );

//   const handleFetchExpenses = () => {
//     if (fromDate && toDate) setFetchExpenses(true);
//   };

//   return (
//     <div className="p-4 space-y-8">
//       <h1 className="text-2xl font-bold">Accounting Dashboard</h1>

//       <section>
//         <h2 className="text-xl font-semibold">Chart of Accounts</h2>
//         <ul>
//           {chartOfAccounts?.map((acc) => (
//             <li key={acc.id}>{acc.code} - {acc.name}</li>
//           ))}
//         </ul>
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold">Trial Balance</h2>
//         <ul>
//           {trialBalance?.map((tb) => (
//             <li key={tb.accountCode}>{tb.accountName}: {tb.balance}</li>
//           ))}
//         </ul>
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold">Profit & Loss</h2>
//         {profitLoss && (
//           <div>
//             <p>Revenue: {profitLoss.revenue}</p>
//             <p>Expenses: {profitLoss.expenses}</p>
//             <p>Net Profit: {profitLoss.netProfit}</p>
//           </div>
//         )}
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold">Balance Sheet</h2>
//         {balanceSheet && (
//           <div>
//             <p>Assets: {balanceSheet.assets}</p>
//             <p>Liabilities: {balanceSheet.liabilities}</p>
//             <p>Equity: {balanceSheet.equity}</p>
//           </div>
//         )}
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold">Expense Report</h2>
//         <div className="flex gap-2 mb-2">
//           <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-1" />
//           <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-1" />
//           <button onClick={handleFetchExpenses} className="bg-blue-500 text-white px-3 rounded">
//             Fetch
//           </button>
//         </div>
//         <ul>
//           {expenses?.map(exp => (
//             <li key={exp.id}>{exp.date}: {exp.amount} ({exp.category})</li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// }
