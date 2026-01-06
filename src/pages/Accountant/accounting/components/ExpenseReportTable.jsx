"use client";

import React, { useState, useMemo } from "react";
import { useGetExpenseReportQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ExpenseReportTable() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch report based on date range
  const { data: expenses, isLoading, error, refetch } = useGetExpenseReportQuery(
    { from: fromDate, to: toDate },
    { skip: !fromDate || !toDate }
  );

  const handleSearch = () => {
    refetch();
  };

  // Calculate total amount
  const totalAmount = useMemo(() => {
    if (!expenses) return 0;
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error fetching data.</p>}

      {expenses && expenses.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.amount}</TableCell>
              </TableRow>
            ))}

            {/* Total row */}
            <TableRow className="font-bold">
              <TableCell colSpan={3} className="text-right">
                Total
              </TableCell>
              <TableCell>{totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      {expenses && expenses.length === 0 && (
        <p>No expenses found for selected dates.</p>
      )}
    </div>
  );
}
