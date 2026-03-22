"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetTrialBalanceQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import ContentLayout from "../../../Dashboard/ContentLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  RefreshCw, 
  Calendar, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ===================== HELPERS ===================== */
const formatValue = (val) => 
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val || 0);

/* ===================== MAIN COMPONENT ===================== */
export default function TrialBalance() {
  const { selectedBranchId } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const today = new Date();
  const defaultStart = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1).toISOString(), [today]);
  const defaultEnd = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString(), [today]);

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  const { data = [], isLoading, isError, refetch } = useGetTrialBalanceQuery({
    branchId: selectedBranchId,
    start,
    end,
  });

  const filteredData = useMemo(() => 
    data.filter(item => item.accountName.toLowerCase().includes(searchTerm.toLowerCase())), 
    [data, searchTerm]
  );

  const totalDebit = data.reduce((sum, tb) => sum + (tb.totalDebit || 0), 0);
  const totalCredit = data.reduce((sum, tb) => sum + (tb.totalCredit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  if (isError) return <div className="p-8 text-center text-rose-500 font-bold">Error loading Trial Balance. Please check connection.</div>;

  return (
    <ContentLayout
      title="Trial Balance"
      loadingSpinner={isLoading}
      subTitle="Master Summary of Ledger Accounts"
    >
      <div className="max-w-[1400px] mx-auto space-y-6 pb-12">

        {/* TOP INTERFACE: FILTERS & TOOLS */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50">
              <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
              <input 
                type="date" 
                value={start.slice(0, 10)} 
                onChange={(e) => setStart(new Date(e.target.value).toISOString())}
                className="bg-transparent text-sm border-none focus:ring-0 text-foreground font-medium"
              />
              <ArrowRightLeft className="h-3 w-3 text-muted-foreground/40" />
              <input 
                type="date" 
                value={end.slice(0, 10)} 
                onChange={(e) => setEnd(new Date(e.target.value).toISOString())}
                className="bg-transparent text-sm border-none focus:ring-0 text-foreground font-medium"
              />
            </div>
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search account..." 
                className="pl-9 w-64 bg-muted/30 border-none rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={refetch} variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button variant="outline" className="rounded-xl border-dashed border-2 flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* RECONCILIATION SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-none shadow-xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Debits</p>
                  <h3 className="text-3xl font-black text-white mt-2 font-mono">{formatValue(totalDebit)}</h3>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-none shadow-xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Credits</p>
                  <h3 className="text-3xl font-black text-white mt-2 font-mono">{formatValue(totalCredit)}</h3>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "border-none shadow-xl transition-all duration-500",
            isBalanced ? "bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20" : "bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/20"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-4 rounded-full", isBalanced ? "bg-emerald-500/20 text-emerald-600" : "bg-rose-500/20 text-rose-600")}>
                  {isBalanced ? <CheckCircle2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8 animate-bounce" />}
                </div>
                <div>
                  <h4 className={cn("text-lg font-black", isBalanced ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")}>
                    {isBalanced ? "Books Balanced" : "Out of Balance"}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    {isBalanced ? "All debits match credits perfectly." : `Variance: ${formatValue(Math.abs(totalDebit - totalCredit))}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TRIAL BALANCE DATA */}
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/30">
                <tr className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest border-b border-border/50">
                  <th className="px-8 py-5">General Ledger Account</th>
                  <th className="px-8 py-5 text-right bg-emerald-50/10 dark:bg-emerald-500/5">Debit Balance</th>
                  <th className="px-8 py-5 text-right bg-indigo-50/10 dark:bg-indigo-500/5">Credit Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredData.map((tb, idx) => (
                  <tr key={idx} className="hover:bg-accent/40 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {tb.accountName}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">REF: #{idx + 1001}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right font-mono text-sm text-emerald-600 dark:text-emerald-400">
                      {tb.totalDebit > 0 ? formatValue(tb.totalDebit) : "—"}
                    </td>
                    <td className="px-8 py-4 text-right font-mono text-sm text-indigo-600 dark:text-indigo-400">
                      {tb.totalCredit > 0 ? formatValue(tb.totalCredit) : "—"}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                   <tr>
                     <td colSpan={3} className="px-8 py-20 text-center text-muted-foreground">
                        No accounts found matching your search.
                     </td>
                   </tr>
                )}
              </tbody>
              <tfoot className="bg-muted/50 font-black">
                <tr className="border-t-2 border-border">
                  <td className="px-8 py-6 text-sm uppercase tracking-widest">Grand Total</td>
                  <td className={cn(
                    "px-8 py-6 text-right text-xl font-mono",
                    isBalanced ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {formatValue(totalDebit)}
                  </td>
                  <td className={cn(
                    "px-8 py-6 text-right text-xl font-mono",
                    isBalanced ? "text-indigo-600" : "text-rose-600"
                  )}>
                    {formatValue(totalCredit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}