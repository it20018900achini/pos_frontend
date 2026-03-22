"use client";

import React, { useState } from "react";
import { useGetProfitLossQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  TrendingUp, TrendingDown, Wallet, Calendar, 
  RefreshCw, ChevronRight, ListFilter,
  ArrowUpRight, Minus 
} from "lucide-react";
import { useSelector } from "react-redux";
import ContentLayout from "../../../Dashboard/ContentLayout";
import { cn } from "@/lib/utils";

/* ===================== HELPERS ===================== */
const computeTotal = (acc) => {
  if (!acc.children || acc.children.length === 0) return (acc.credit || 0) - (acc.debit || 0);
  return acc.children.reduce((sum, c) => sum + computeTotal(c), 0);
};

const formatAmount = (val) => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    signDisplay: 'never' 
  }).format(Math.abs(val));

/* ===================== THEME-AWARE ROW ===================== */
const AccountRow = ({ acc, level, expanded, toggle }) => {
  const hasChildren = acc.children?.length > 0;
  const isExpanded = expanded.has(acc.id);
  const total = computeTotal(acc);

  return (
    <>
      <tr 
        className={cn(
          "group border-b border-border/40 transition-colors duration-200",
          hasChildren 
            ? "bg-muted/30 font-semibold dark:bg-slate-900/40" 
            : "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
        )}
      >
        <td className="py-3.5 px-4 relative" style={{ paddingLeft: `${level * 24 + 20}px` }}>
          {/* Vertical Guide Line - Visible in both modes */}
          {level > 0 && (
            <div 
              className="absolute top-0 bottom-0 w-px bg-border/60" 
              style={{ left: `${(level - 1) * 24 + 32}px` }} 
            />
          )}
          
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button 
                onClick={() => toggle(acc.id)} 
                className="z-10 p-1 bg-background hover:bg-accent rounded border border-border shadow-sm transition-transform active:scale-90"
              >
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-200 text-muted-foreground", isExpanded && "rotate-90 text-foreground")} />
              </button>
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground/30 ml-1" />
            )}
            <span className="text-foreground text-sm tracking-tight">{acc.accountName}</span>
          </div>
        </td>
        <td className="py-3.5 px-4 text-xs font-mono text-muted-foreground">{acc.accountCode}</td>
        <td className="py-3.5 px-4 text-right text-sm text-muted-foreground/80 font-medium">
            {acc.debit > 0 ? formatAmount(acc.debit) : "—"}
        </td>
        <td className="py-3.5 px-4 text-right text-sm text-muted-foreground/80 font-medium">
            {acc.credit > 0 ? formatAmount(acc.credit) : "—"}
        </td>
        <td className="py-3.5 px-4 text-right">
          <span className={cn(
            "text-sm font-bold",
            hasChildren ? "text-foreground" : "text-muted-foreground/60 font-medium"
          )}>
            {formatAmount(total)}
          </span>
        </td>
      </tr>

      {hasChildren && isExpanded && acc.children.map((child) => (
        <AccountRow 
          key={child.id || child.accountCode} 
          acc={child} 
          level={level + 1} 
          expanded={expanded} 
          toggle={toggle} 
        />
      ))}
    </>
  );
};

/* ===================== MAIN COMPONENT ===================== */
export default function ProfitLossReport() {
  const { selectedBranchId } = useSelector((state) => state.user);
  
  const [start, setStart] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
  const [end, setEnd] = useState(new Date().toISOString());
  const [expanded, setExpanded] = useState(new Set());

  const { data: report, isLoading, refetch } = useGetProfitLossQuery({ branchId: selectedBranchId, start, end });

  const incomes = report?.incomes || [];
  const expenses = report?.expenses || [];
  
  const totalIncome = incomes.reduce((s, a) => s + computeTotal(a), 0);
  const totalExpense = Math.abs(expenses.reduce((s, a) => s + computeTotal(a), 0));
  const netProfit = totalIncome - totalExpense;

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <ContentLayout loadingSpinner={isLoading} title="Profit & Loss" subTitle="Financial analytics engine">
      <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 md:px-0">
        
        {/* FILTER BAR - Dark Mode optimized */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50">
              <div className="px-3 py-1.5 bg-background rounded-lg shadow-sm text-[10px] font-black text-muted-foreground flex items-center gap-2 uppercase">
                <Calendar className="h-3 w-3" /> Date Range
              </div>
              <input 
                type="date" 
                value={format(new Date(start), "yyyy-MM-dd")} 
                onChange={(e) => setStart(new Date(e.target.value).toISOString())}
                className="bg-transparent text-sm border-none focus:ring-0 px-2 text-foreground font-medium"
              />
              <span className="text-muted-foreground/30">—</span>
              <input 
                type="date" 
                value={format(new Date(end), "yyyy-MM-dd")} 
                onChange={(e) => setEnd(new Date(e.target.value).toISOString())}
                className="bg-transparent text-sm border-none focus:ring-0 px-2 text-foreground font-medium"
              />
            </div>
          </div>
          <Button onClick={refetch} className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl px-6 transition-all active:scale-95 font-bold tracking-tight">
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} /> 
            Update View
          </Button>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-emerald-500/10 dark:bg-emerald-500/5 border-l-4 border-emerald-500">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Revenue</p>
              <div className="flex items-center justify-between mt-2">
                <h3 className="text-3xl font-bold text-foreground">{formatAmount(totalIncome)}</h3>
                <div className="p-2 bg-emerald-500/20 rounded-full">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-rose-500/10 dark:bg-rose-500/5 border-l-4 border-rose-500">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Expenses</p>
              <div className="flex items-center justify-between mt-2">
                <h3 className="text-3xl font-bold text-foreground">{formatAmount(totalExpense)}</h3>
                <div className="p-2 bg-rose-500/20 rounded-full text-xs font-bold text-rose-700 dark:text-rose-400">
                  {((totalExpense / (totalIncome || 1)) * 100).toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "border-none shadow-xl text-white",
            netProfit >= 0 ? "bg-slate-900 dark:bg-indigo-600" : "bg-rose-900 dark:bg-rose-700"
          )}>
            <CardContent className="p-6">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Net Profit</p>
              <div className="flex items-center justify-between mt-2">
                <h3 className="text-3xl font-black">{formatAmount(netProfit)}</h3>
                <ArrowUpRight className={cn("h-6 w-6 text-white/40")} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION TABLES */}
        <div className="grid grid-cols-1 gap-10">
          {[
            { title: "Income streams", data: incomes, color: "text-emerald-500" },
            { title: "Operating Expenses", data: expenses, color: "text-rose-500" }
          ].map((sec, i) => (
            <div key={i} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center gap-3 bg-muted/20">
                <ListFilter className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-black text-foreground text-xs uppercase tracking-widest">{sec.title}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/10">
                    <tr className="text-[10px] uppercase font-bold text-muted-foreground/70 border-b border-border/60">
                      <th className="px-6 py-4">Account Details</th>
                      <th className="px-4 py-4">Code</th>
                      <th className="px-4 py-4 text-right">Debit</th>
                      <th className="px-4 py-4 text-right">Credit</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sec.data.map((acc) => (
                      <AccountRow key={acc.id} acc={acc} level={0} expanded={expanded} toggle={toggle} />
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold text-foreground">
                    <tr className="border-t border-border">
                      <td className="px-6 py-6 text-xs uppercase tracking-widest text-muted-foreground" colSpan={4}>Consolidated {sec.title}</td>
                      <td className="px-6 py-6 text-right text-xl font-black decoration-double underline decoration-primary/20">
                        {formatAmount(sec.data.reduce((sum, a) => sum + computeTotal(a), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}