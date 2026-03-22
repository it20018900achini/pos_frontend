"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  useLazyGetLedgerQuery, 
  useDeleteJournalMutation 
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Trash2, 
  ArrowUpRight, 
  History, 
  FileSearch, 
  AlertCircle,
  ChevronDown,
  Printer,
  FileDown,
  ArrowDownLeft,
  ArrowUpRight as ArrowUpIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import LedgerDialog from "./LedgerDialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LedgerPDF } from "./LedgerPDF";

/* ================= UTILS ================= */
const ACCOUNT_BEHAVIOR = {
  ASSET: { debit: "positive", credit: "negative" },
  EXPENSE: { debit: "positive", credit: "negative" },
  LIABILITY: { debit: "negative", credit: "positive" },
  EQUITY: { debit: "negative", credit: "positive" },
  INCOME: { debit: "negative", credit: "positive" },
};

const getBalanceDirection = (balance, type) => {
  if (balance === 0) return "";
  const behavior = ACCOUNT_BEHAVIOR[type] || ACCOUNT_BEHAVIOR.ASSET;
  const isDebitPositive = behavior.debit === "positive";
  return isDebitPositive 
    ? (balance >= 0 ? "DR" : "CR") 
    : (balance >= 0 ? "CR" : "DR");
};

const formatAmount = (val) =>
  new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(Math.abs(val || 0));

export default function Ledger({ accountId, accountType = "ASSET" }) {
  const pageSize = 2; // Slightly larger for better scrolling
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [ledgerData, setLedgerData] = useState({ 
    rows: [], bfBalance: 0, cfBalance: 0, hasMore: false 
  });
  
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [getLedger, { isLoading }] = useLazyGetLedgerQuery();
  const [deleteJournal, { isLoading: deleting }] = useDeleteJournalMutation();

  useEffect(() => { fetchPage(0, true); }, [accountId]);

  const fetchPage = async (pageNumber, isInitial = false) => {
    try {
      if (!isInitial) setIsLoadingMore(true);
      const result = await getLedger({ accountId, page: pageNumber, size: pageSize }).unwrap();
      setLedgerData((prev) => ({
        rows: isInitial ? result.rows : [...prev.rows, ...result.rows],
        bfBalance: result.bfBalance,
        cfBalance: isInitial ? result.cfBalance : prev.cfBalance,
        hasMore: result.hasMore,
      }));
      setPage(pageNumber);
    } catch (e) { console.error(e); } finally { setIsLoadingMore(false); }
  };

  const confirmDelete = async () => {
    try {
      await deleteJournal(deleteId).unwrap();
      setDeleteId(null);
      fetchPage(0, true);
    } catch (e) { console.error(e); }
  };

  const displayRows = useMemo(() => [...ledgerData.rows].reverse(), [ledgerData.rows]);
  const activityTotals = useMemo(() => {
    return ledgerData.rows.reduce((acc, row) => ({
        debit: acc.debit + (Number(row.debit) || 0),
        credit: acc.credit + (Number(row.credit) || 0),
      }), { debit: 0, credit: 0 });
  }, [ledgerData.rows]);

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-3 lg:p-6 pb-24 md:pb-6 animate-in fade-in duration-500">
      
      {/* 1. HEADER & EXPORT (Desktop & Mobile Unified) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 md:p-6 rounded-[2rem] border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Ledger</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-muted rounded font-mono text-[9px] font-bold text-muted-foreground">REF: {accountId}</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-primary/10 text-primary">{accountType}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on very small screens, shown in sticky footer instead) */}
        <div className="hidden sm:flex gap-2 w-full md:w-auto">
          <PDFDownloadLink
            document={<LedgerPDF data={displayRows} accountId={accountId} accountType={accountType} bfBalance={ledgerData.bfBalance} cfBalance={ledgerData.cfBalance} totals={activityTotals} />}
            fileName={`Ledger_${accountId}.pdf`}
          >
            {({ loading }) => (
              <Button variant="outline" size="sm" disabled={loading} className="rounded-xl font-bold border-dashed">
                <Printer className="h-4 w-4 mr-2" /> {loading ? "..." : "PDF"}
              </Button>
            )}
          </PDFDownloadLink>
          <Button variant="outline" size="sm" className="rounded-xl font-bold border-dashed">
            <FileDown className="h-4 w-4 mr-2" /> EXCEL
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (MOBILE ONLY) */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Total Debit</p>
          <p className="text-lg font-black text-emerald-700">{formatAmount(activityTotals.debit)}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-rose-600 uppercase">Total Credit</p>
          <p className="text-lg font-black text-rose-700">{formatAmount(activityTotals.credit)}</p>
        </div>
      </div>

      {/* 3. MAIN DATA AREA */}
      <div className="bg-card rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
        
        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                <th className="px-6 py-6">Date</th>
                <th className="px-6 py-6">Description</th>
                <th className="px-6 py-6">Offset Accounts</th>
                <th className="px-6 py-6 text-right bg-emerald-500/5">Debit (+)</th>
                <th className="px-6 py-6 text-right bg-rose-500/5">Credit (-)</th>
                <th className="px-6 py-6 text-right bg-primary/5">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {/* B/F Row */}
              <tr className="bg-muted/20 font-bold">
                <td className="px-6 py-4 text-[10px] uppercase text-muted-foreground" colSpan={3}>Opening Balance (B/F)</td>
                <td className="px-6 py-4 text-right">—</td>
                <td className="px-6 py-4 text-right">—</td>
                <td className="px-6 py-4 text-right font-mono text-sm font-bold bg-primary/5">
                  {formatAmount(ledgerData.bfBalance)} <span className="text-[10px] text-primary/60">{getBalanceDirection(ledgerData.bfBalance, accountType)}</span>
                </td>
              </tr>
              {/* Transactions */}
              {displayRows.map((row) => (
                <tr key={row.id} className="group hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-5 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(row.entryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{row.description}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">#TX-{row.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {row.relatedLines?.map((r, i) => (
                        <button key={i} onClick={() => { setSelectedAccount(r.account); setDialogOpen(true); }} className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-md flex items-center gap-1">
                          {r.account.name} <ArrowUpRight className="h-2 w-2" />
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-sm text-emerald-600 font-bold bg-emerald-500/5">{row.debit > 0 ? formatAmount(row.debit) : "—"}</td>
                  <td className="px-6 py-5 text-right font-mono text-sm text-rose-600 font-bold bg-rose-500/5">{row.credit > 0 ? formatAmount(row.credit) : "—"}</td>
                  <td className="px-6 py-5 text-right font-mono text-sm font-black bg-primary/5">{formatAmount(row.balance)} <span className="text-[9px] font-normal">{getBalanceDirection(row.balance, accountType)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Transaction Cards */}
        <div className="md:hidden divide-y divide-border">
          {/* Mobile B/F */}
          <div className="p-4 bg-muted/20 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-muted-foreground">Opening Balance</span>
            <span className="font-mono font-bold text-primary">{formatAmount(ledgerData.bfBalance)}</span>
          </div>
          
          {displayRows.map((row) => (
            <div key={row.id} className="p-4 space-y-3 active:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold">{new Date(row.entryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-sm font-black text-foreground leading-tight">{row.description}</p>
                </div>
                <button onClick={() => setDeleteId(row.id)} className="p-2 text-rose-500 bg-rose-50 rounded-full"><Trash2 className="h-4 w-4" /></button>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-1 max-w-[60%]">
                  {row.relatedLines?.map((r, i) => (
                    <span key={i} className="text-[9px] font-bold bg-muted px-2 py-1 rounded text-muted-foreground">@{r.account.name}</span>
                  ))}
                </div>
                <div className="text-right">
                  {row.debit > 0 ? (
                    <p className="text-emerald-600 font-mono font-bold text-sm">+{formatAmount(row.debit)}</p>
                  ) : (
                    <p className="text-rose-600 font-mono font-bold text-sm">-{formatAmount(row.credit)}</p>
                  )}
                  <p className="text-[10px] font-black text-primary/60 mt-0.5">BAL: {formatAmount(row.balance)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION / FOOTER */}
        <div className="p-4 md:p-8 flex flex-col items-center gap-4 border-t bg-muted/5">
          {ledgerData.hasMore && (
            <Button variant="outline" onClick={() => fetchPage(page + 1)} disabled={isLoadingMore} className="w-full md:w-auto rounded-full px-8">
              {isLoadingMore ? "Loading..." : "Load More"} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}
          <div className="w-full flex justify-between items-center md:hidden pt-4 border-t border-dashed">
             <span className="text-xs font-bold text-muted-foreground">CLOSING BALANCE</span>
             <span className="text-xl font-black text-primary underline decoration-double underline-offset-4">
                {formatAmount(ledgerData.cfBalance)}
             </span>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50 flex gap-2">
         <PDFDownloadLink
            className="flex-1"
            document={<LedgerPDF data={displayRows} accountId={accountId} accountType={accountType} bfBalance={ledgerData.bfBalance} cfBalance={ledgerData.cfBalance} totals={activityTotals} />}
            fileName={`Ledger.pdf`}
          >
            <Button className="w-full h-14 rounded-2xl shadow-2xl font-black uppercase tracking-widest text-xs">
              <Printer className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </PDFDownloadLink>
      </div>

      {/* Keep existing Dialogs (Delete/Drilldown) - Shadcn UI handles mobile scaling automatically */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
         {/* ... (Existing Dialog Code) ... */}
      </Dialog>
    </div>
  );
}