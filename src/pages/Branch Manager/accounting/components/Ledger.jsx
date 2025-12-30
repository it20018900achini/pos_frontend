// Ledger.js
"use client";

import React, { useState, useEffect } from "react";
import { useLazyGetLedgerQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import LedgerDialog from "./LedgerDialog";

export default function Ledger({ accountCode }) {
  const pageSize = 5;
  const [page, setPage] = useState(0);
  const [ledgerData, setLedgerData] = useState({
    rows: [],
    bfBalance: 0,
    hasMore: true,
  });

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [getLedger, { isLoading, isError }] = useLazyGetLedgerQuery();

  useEffect(() => {
    setLedgerData({ rows: [], bfBalance: 0, hasMore: true });
    setPage(0);
    fetchPage(0);
  }, [accountCode]);

  const fetchPage = async (pageNumber) => {
    try {
      const result = await getLedger({
        accountCode,
        page: pageNumber,
        size: pageSize,
      }).unwrap();

      setLedgerData((prev) => ({
        rows: [...prev.rows, ...result.rows],
        bfBalance: pageNumber === 0 ? result.bfBalance : prev.bfBalance,
        hasMore: result.hasMore,
      }));

      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching ledger:", err);
    }
  };

  const openAccountDialog = (account) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const normalRows = ledgerData.rows.filter((r) => r.entryDate !== null);
  const totalDebit = normalRows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = normalRows.reduce((sum, r) => sum + r.credit, 0);
  const endingBalance = normalRows.length
    ? normalRows[normalRows.length - 1].balance
    : ledgerData.bfBalance;

  const getRowColor = (row) => {
    if (row.credit > 0) return "bg-red-50";
    if (row.debit > 0) return "bg-green-50";
    return "";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Ledger – {accountCode}</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-left">Date</th>
            <th className="border px-2 py-1 text-left">Description</th>
            <th className="border px-2 py-1 text-left">Related Accounts</th>
            <th className="border px-2 py-1 text-right">Debit</th>
            <th className="border px-2 py-1 text-right">Credit</th>
            <th className="border px-2 py-1 text-right">Balance</th>
          </tr>
        </thead>

        <tbody>
          {/* B/F Balance */}
          <tr className="font-semibold bg-gray-100 border-b border-gray-300">
            <td colSpan={3}>B/F Balance</td>
            <td className="text-right">0.00</td>
            <td className="text-right">0.00</td>
            <td className="text-right">
              {ledgerData.bfBalance.toFixed(2)}
            </td>
          </tr>

          {/* Ledger rows */}
          {ledgerData.rows.map((row, idx) => {
            const rowColor = getRowColor(row);

            return (
              <React.Fragment key={idx}>
                <tr className={`${rowColor} border-t border-gray-200`}>
                  <td>{row.entryDate ? new Date(row.entryDate).toLocaleDateString() : "-"}</td>
                  <td>{row.description}</td>
                 
                  <td className="text-right text-green-700">{row.debit.toFixed(2)}</td>
                  <td className="text-right text-red-500">{row.credit.toFixed(2)}</td>
                  <td className={`text-right ${row.balance < 0 ? "text-red-500" : ""}`}>
                    {row.balance.toFixed(2)}
                  </td>
                </tr>
                 <tr colSpan={5}>
                    {row.relatedLines?.length > 0
                      ? row.relatedLines.map((r, i) => (
                          <Button
                            key={i}
                            variant="link"
                            className="p-0 text-blue-600 hover:underline text-sm mr-2"
                            onClick={() => openAccountDialog(r.account)}
                          >
                            {r.account.code} - {r.account.name}
                          </Button>
                        ))
                      : "-"}
                  </tr>
              </React.Fragment>
            );
          })}
        </tbody>

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan={3}>Totals</td>
            <td className="text-right text-green-800">{totalDebit.toFixed(2)}</td>
            <td className="text-right text-red-800">{totalCredit.toFixed(2)}</td>
            <td className="text-right font-bold">{endingBalance.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      {ledgerData.hasMore && (
        <Button onClick={() => fetchPage(page + 1)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90%] overflow-y-auto h-screen ">
          <DialogHeader>
            <DialogTitle>Account Ledger</DialogTitle>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-2 mt-2">
              <div><strong>Code:</strong> {selectedAccount.code}</div>
              <div><strong>Name:</strong> {selectedAccount.name}</div>
              <div><strong>Type:</strong> {selectedAccount.type}</div>
            </div>
          )}

          {/* Pass selectedAccount.code to LedgerDialog */}
          {selectedAccount && <LedgerDialog accountCode={selectedAccount.code} />}

          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
