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

  const [getLedger, { isLoading, isError }] = useLazyGetLedgerQuery();

  // Reset ledger whenever accountCode changes
  useEffect(() => {
    setLedgerData({ bfBalance: 0, rows: [], hasMore: true });
    setPage(0);
    fetchPage(0);
  }, [accountCode]);

  const fetchPage = async (pageNumber) => {
    try {
      const result = await getLedger({ accountCode, page: pageNumber, size: 5 }).unwrap();

      if (pageNumber === 0) {
        setLedgerData({
          bfBalance: result.bfBalance,
          rows: result.rows,
          hasMore: result.hasMore,
        });
      } else {
        setLedgerData((prev) => ({
          ...prev,
          rows: [...prev.rows, ...result.rows],
          hasMore: result.hasMore,
        }));
      }

      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching ledger:", err);
    }
  };

  if (isLoading && page === 0) return <p>Loading Ledger...</p>;
  if (isError) return <p>Error loading ledger</p>;

  // Sort rows descending by date, put null dates at bottom
  const sortedRows = [...ledgerData.rows].sort((a, b) => {
    if (!a.entryDate) return 1;
    if (!b.entryDate) return -1;
    return new Date(b.entryDate) - new Date(a.entryDate);
  });

  // Totals
  const totalDebit = sortedRows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = sortedRows.reduce((sum, r) => sum + r.credit, 0);
  const endingBalance = ledgerData.bfBalance + totalDebit - totalCredit;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Ledger - {accountCode}</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-left">Date</th>
            <th className="border px-2 py-1 text-left">Description</th>
            <th className="border px-2 py-1 text-left">Account</th>
            <th className="border px-2 py-1 text-right">Debit</th>
            <th className="border px-2 py-1 text-right">Credit</th>
            <th className="border px-2 py-1 text-right">Balance</th>
          </tr>
        </thead>

        <tbody>
          {/* B/F Balance row */}
          <tr className="font-semibold bg-gray-50">
            <td colSpan={5}>B/F Balance</td>
            <td className="text-right">
              {ledgerData.bfBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
          </tr>

          {/* Ledger rows with running balance */}
          {(() => {
            let runningBalance = ledgerData.bfBalance;
            return sortedRows.map((row, idx) => {
              runningBalance += row.debit - row.credit;

              // Row background color
              const rowBgClass =
                row.debit > 0 ? "bg-green-50" : row.credit > 0 ? "bg-red-50" : "";

              return (
                <tr key={idx} className={rowBgClass}>
                  <td>{row.entryDate ? new Date(row.entryDate).toLocaleDateString() : "-"}</td>
                  <td>{row.description}</td>
                  <td>
                    {row.accountInfoDTO
                      ? `${row.accountInfoDTO.code} - ${row.accountInfoDTO.name}`
                      : "-"}
                  </td>
                  <td className="text-right font-medium text-green-700">
                    {row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-right font-medium text-red-700">
                    {row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td
                    className={`text-right font-semibold ${
                      runningBalance < 0 ? "text-red-600" : ""
                    }`}
                  >
                    {runningBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            });
          })()}
        </tbody>

        {/* Totals row */}
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan={3} className="text-left">Totals</td>
            <td className="text-right text-green-800">
              {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
            <td className="text-right text-red-800">
              {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
            <td className="text-right font-bold">
              {endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
          </tr>

          {/* C/F Balance row */}
          <tr className="font-semibold bg-gray-50">
            <td colSpan={5}>C/F Balance (Last Balance)</td>
            <td className="text-right">
              {endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Load more button */}
      {ledgerData.hasMore && (
        <Button onClick={() => fetchPage(page + 1)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
