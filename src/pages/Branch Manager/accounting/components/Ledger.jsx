"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLazyGetLedgerQuery, useDeleteJournalMutation } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import LedgerDialog from "./LedgerDialog";
import { Trash2 } from "lucide-react";

/* ================= ACCOUNTING RULES ================= */
const ACCOUNT_BEHAVIOR = {
  ASSET: { debit: "positive", credit: "negative" },
  EXPENSE: { debit: "positive", credit: "negative" },
  LIABILITY: { debit: "negative", credit: "positive" },
  EQUITY: { debit: "negative", credit: "positive" },
  INCOME: { debit: "negative", credit: "positive" },
};

const getAmountColor = (amount, type, side) => {
  if (!amount || amount === 0) return "";
  const behavior = ACCOUNT_BEHAVIOR[type];
  if (!behavior) return "";
  return behavior[side] === "positive" ? "text-green-700" : "text-red-600";
};

const getBalanceColor = (balance, type) => {
  if (balance === 0) return "";
  const behavior = ACCOUNT_BEHAVIOR[type];
  if (!behavior) return "";
  const isDebitPositive = behavior.debit === "positive";
  const isPositive = balance >= 0;
  return isDebitPositive === isPositive ? "text-green-700" : "text-red-600";
};

const getBalanceDirection = (balance, type) => {
  if (balance === 0) return "";
  const behavior = ACCOUNT_BEHAVIOR[type];
  if (!behavior) return "";
  return behavior.debit === "positive" ? (balance >= 0 ? "DR" : "CR") : (balance >= 0 ? "CR" : "DR");
};

const formatAmount = (val) =>
  Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2 });

/* ================= COMPONENT ================= */
export default function Ledger({ accountCode, accountType = "ASSET" }) {
  const pageSize = 5;
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [ledgerData, setLedgerData] = useState({ rows: [], bfBalance: 0, hasMore: true });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const dialogContentRef = useRef(null); // <-- ref for scrolling

  const [getLedger, { isLoading }] = useLazyGetLedgerQuery();
  const [deleteJournal, { isLoading: deleting }] = useDeleteJournalMutation();

  useEffect(() => {
    setLedgerData({ rows: [], bfBalance: 0, hasMore: true });
    setPage(0);
    fetchPage(0);
  }, [accountCode]);

  const fetchPage = async (pageNumber) => {
    const MIN_LOADING = 500;
    try {
      if (pageNumber > 0) setIsLoadingMore(true);

      const delay = new Promise((r) => setTimeout(r, MIN_LOADING));
      const request = getLedger({ accountCode, page: pageNumber, size: pageSize }).unwrap();
      const [, result] = await Promise.all([delay, request]);

      setLedgerData((prev) => ({
        rows: [...prev.rows, ...result.rows],
        bfBalance: pageNumber === 0 ? result.bfBalance : prev.bfBalance,
        hasMore: result.hasMore,
      }));

      setPage(pageNumber);

      // Scroll to bottom of dialog content after loading more
      setTimeout(() => {
        if (dialogContentRef.current) {
          dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight;
        }
      }, 50);

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteJournal(deleteId).unwrap();
      setLedgerData({ rows: [], bfBalance: 0, hasMore: true });
      setPage(0);
      fetchPage(0);
    } finally {
      setDeleteId(null);
    }
  };

  const normalRows = ledgerData.rows.filter((r) => r.entryDate !== null);
  const totalDebit = normalRows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = normalRows.reduce((s, r) => s + r.credit, 0);
  const endingBalance = normalRows.length ? normalRows[normalRows.length - 1].balance : ledgerData.bfBalance;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ledger – {accountCode}</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Related Accounts</th>
            <th className="border px-2 py-1 text-right">Debit</th>
            <th className="border px-2 py-1 text-right">Credit</th>
            <th className="border px-2 py-1 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-semibold bg-gray-100">
            <td colSpan={3}>B/F Balance</td>
            <td className="text-right">0.00</td>
            <td className="text-right">0.00</td>
            <td className="text-right">
              {formatAmount(ledgerData.bfBalance)}{" "}
              <span className="text-xs">{getBalanceDirection(ledgerData.bfBalance, accountType)}</span>
            </td>
          </tr>

          {ledgerData.rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td>{row.entryDate ? new Date(row.entryDate).toLocaleDateString() : "-"}</td>
              <td>
                {row.description}-{row.id}
                {row.id&&<Button
                  size="sm"
                  variant="link"
                  className="ml-2 cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => setDeleteId(row.id)}
                >
                  <Trash2/>
                </Button>}
              </td>
              <td>
                {row.relatedLines?.map((r, i) => (
                  <Button
                    key={i}
                    variant="link"
                    className="p-0 mr-2 text-blue-600"
                    onClick={() => {
                      setSelectedAccount(r.account);
                      setDialogOpen(true);
                    }}
                  >
                    {r.account.code}-{r.account.name}
                  </Button>
                ))}
              </td>
              <td className={`text-right ${getAmountColor(row.debit, accountType, "debit")}`}>
                {formatAmount(row.debit)}
              </td>
              <td className={`text-right ${getAmountColor(row.credit, accountType, "credit")}`}>
                {formatAmount(row.credit)}
              </td>
              <td className={`text-right font-medium ${getBalanceColor(row.balance, accountType)}`}>
                {formatAmount(row.balance)} <span className="text-xs">{getBalanceDirection(row.balance, accountType)}</span>
              </td>
            </tr>
          ))}

          {(isLoading || isLoadingMore) && (
            <tr>
              <td colSpan={6} className="py-4 text-center">
                <div className="flex justify-center gap-2 items-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  Loading…
                </div>
              </td>
            </tr>
          )}
        </tbody>

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan={3}>Totals</td>
            <td className="text-right">{formatAmount(totalDebit)}</td>
            <td className="text-right">{formatAmount(totalCredit)}</td>
            <td className="text-right">
              {formatAmount(endingBalance)} <span className="text-xs">{getBalanceDirection(endingBalance, accountType)}</span>
            </td>
          </tr>
        </tfoot>
      </table>

      {ledgerData.hasMore && (
        <Button onClick={() => fetchPage(page + 1)} disabled={isLoadingMore}>
          {isLoadingMore ? "Loading..." : "Load More"}
        </Button>
      )}

      {/* Ledger Account Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[90%] overflow-y-auto h-screen" ref={dialogContentRef}>
          <DialogHeader>
            <DialogTitle>Account Ledger</DialogTitle>
          </DialogHeader>
          {selectedAccount && <LedgerDialog accountCode={selectedAccount.code} />}
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Journal Entry?</DialogTitle>
          </DialogHeader>

          {deleteId && (() => {
            const row = ledgerData.rows.find((r) => r.id === deleteId);
            if (!row) return <p className="text-gray-500">Entry not found.</p>;

            const relatedLines = row.relatedLines || [];
            const totalDebit = relatedLines.reduce((s, r) => s + r.debit, 0) + row.debit;
            const totalCredit = relatedLines.reduce((s, r) => s + r.credit, 0) + row.credit;

            return (
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <div><strong>Date:</strong> {row.entryDate ? new Date(row.entryDate).toLocaleDateString() : "-"}</div>
                  <div><strong>Description:</strong> {row.description}</div>
                  <div><strong>Balance:</strong> {row.balance.toFixed(2)}</div>
                </div>

                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">Account</th>
                      <th className="border px-2 py-1 text-right">Debit</th>
                      <th className="border px-2 py-1 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-2 py-1 font-medium">Current Entry</td>
                      <td className="px-2 py-1 text-right">{row.debit.toFixed(2)}</td>
                      <td className="px-2 py-1 text-right">{row.credit.toFixed(2)}</td>
                    </tr>
                    {relatedLines.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1">{r.account.code} - {r.account.name}</td>
                        <td className="px-2 py-1 text-right">{r.debit.toFixed(2)}</td>
                        <td className="px-2 py-1 text-right">{r.credit.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 font-semibold border-t">
                    <tr>
                      <td className="px-2 py-1">Total</td>
                      <td className="px-2 py-1 text-right">{totalDebit.toFixed(2)}</td>
                      <td className="px-2 py-1 text-right">{totalCredit.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                <p className="text-gray-600 mt-2">
                  This will permanently delete the journal and all its lines. This action cannot be undone.
                </p>
              </div>
            );
          })()}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Confirm Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
