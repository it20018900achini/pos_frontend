"use client";
import React, { useState } from "react";
import { useGetExpensesQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function ExpenseReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fetch, setFetch] = useState(false);

  const { data = [], isLoading, isError, refetch } = useGetExpensesQuery(
    { from: fromDate, to: toDate },
    { skip: !fetch }
  );

  const handleFetch = () => {
    if (fromDate && toDate) setFetch(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Expense Report</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border p-1 rounded"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
        >
          Fetch
        </button>
         {fetch && (
        <button
          onClick={refetch}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      )}
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading expenses</p>}

      <div className="border rounded-md p-2 space-y-1">
        {data.length === 0 && <p>No expenses found</p>}
        {data.map(exp => (
          <div
            key={exp.id}
            className="flex justify-between border-b last:border-b-0 py-1"
          >
            <div>
              <span className="font-medium">{exp.title}</span> -{" "}
              <span className="text-sm text-gray-500">{exp.categoryName}</span>
            </div>
            <div className="flex gap-4">
              <span>{exp.totalAmount.toLocaleString()}</span>
              <span className="text-sm text-gray-500">
                {exp.startDate} to {exp.endDate}
              </span>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}
