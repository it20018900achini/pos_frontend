"use client";

import React, { useState, useEffect } from "react";
import { useLazyGetLedgerQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Button } from "@/components/ui/button";

export default function Ledger({ accountCode }) {
  const [page, setPage] = useState(0);
  const [ledgerData, setLedgerData] = useState({
    bfBalance: 0,
    rows: [],
    hasMore: true,
  });

  const [getLedger, { data, isLoading, isError }] = useLazyGetLedgerQuery();

  // Load first page on mount
  useEffect(() => {
    fetchPage(0);
  }, [accountCode]);

  const fetchPage = async (pageNumber) => {
    try {
      const result = await getLedger({ accountCode, page: pageNumber, size: 5 }).unwrap();

      // First page: set bfBalance and rows
      if (pageNumber === 0) {
        setLedgerData({
          bfBalance: result.bfBalance,
          rows: result.rows,
          hasMore: result.hasMore,
        });
      } else {
        // Append new rows for Load More
        setLedgerData((prev) => ({
          ...prev,
          rows: [...prev.rows, ...result.rows],
          hasMore: result.hasMore,
        }));
      }

      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading && page === 0) return <p>Loading Ledger...</p>;
  if (isError) return <p>Error loading ledger</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Ledger - {accountCode}</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-left">Date</th>
            <th className="border px-2 py-1 text-left">Description</th>
            <th className="border px-2 py-1 text-right">Debit</th>
            <th className="border px-2 py-1 text-right">Credit</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-semibold bg-gray-50">
            <td colSpan={3}>B/F Balance</td>
            <td className="text-right">{ledgerData.bfBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
          {ledgerData.rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.entryDate}</td>
              <td>{row.description}</td>
              <td className="text-right">{row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="text-right">{row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {ledgerData.hasMore && (
        <Button onClick={() => fetchPage(page + 1)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
