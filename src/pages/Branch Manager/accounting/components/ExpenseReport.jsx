"use client";
import React, { useState } from "react";
import { useGetExpensesQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function ExpenseReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fetch, setFetch] = useState(false);

  const { data, isLoading, isError, refetch } = useGetExpensesQuery(
    { from: fromDate, to: toDate },
    { skip: !fetch }
  );

  const handleFetch = () => {
    if (fromDate && toDate) setFetch(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Expense Report</h2>
      <div className="flex gap-2 mb-2">
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border p-1"/>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border p-1"/>
        <button onClick={handleFetch} className="bg-blue-500 text-white px-3 rounded">Fetch</button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading expenses</p>}

      <ul>
        {data?.map(exp => (
          <li key={exp.id}>{exp.date}: {exp.amount} ({exp.category})</li>
        ))}
      </ul>

      {fetch && <button onClick={refetch} className="mt-2 px-2 py-1 bg-gray-200 rounded">Refresh</button>}
    </div>
  );
}
