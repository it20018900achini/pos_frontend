"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  ArrowRightLeft, 
  Calendar, 
  ChevronRight, 
  Minus, 
  PieChart, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import { useSelector } from "react-redux";
import ContentLayout from "../../../Dashboard/ContentLayout";
import { cn } from "@/lib/utils";

/* ===================== HELPERS ===================== */
const computeTotal = (acc) =>
  !acc.children || acc.children.length === 0
    ? acc.balance ?? 0
    : acc.children.reduce((sum, c) => sum + computeTotal(c), 0);

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);

const initializeExpandedMap = (accounts) => {
  const map = {};
  const traverse = (accList) => {
    accList.forEach((acc) => {
      const total = computeTotal(acc);
      if (acc.children?.length > 0 && total !== 0) {
        map[acc.id] = true;
        traverse(acc.children);
      }
    });
  };
  traverse(accounts);
  return map;
};

/* ===================== PREMIUM ROW ===================== */
const BalanceRow = ({ acc, level, expandedMap, toggle }) => {
  const hasChildren = acc.children?.length > 0;
  const isExpanded = expandedMap[acc.id] || false;
  const total = computeTotal(acc);

  return (
    <>
      <tr className={cn(
        "group border-b border-border/40 transition-colors duration-150",
        hasChildren ? "bg-muted/30 font-semibold" : "hover:bg-accent/50"
      )}>
        <td className="py-2.5 px-4 relative" style={{ paddingLeft: `${level * 24 + 16}px` }}>
          {level > 0 && (
            <div className="absolute top-0 bottom-0 w-px bg-border/60" style={{ left: `${(level - 1) * 24 + 28}px` }} />
          )}
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button onClick={() => toggle(acc.id)} className="p-1 rounded hover:bg-background border border-border shadow-sm">
                <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
              </button>
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground/30 ml-1" />
            )}
            <span className="text-sm truncate max-w-[200px]">{acc.account}</span>
          </div>
        </td>
        <td className={cn("py-2.5 px-4 text-right text-xs font-mono", total >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600")}>
          {formatCurrency(acc.balance)}
        </td>
        <td className="py-2.5 px-4 text-right font-bold text-sm">
          {hasChildren ? formatCurrency(total) : ""}
        </td>
      </tr>
      {hasChildren && isExpanded && acc.children.map((child) => (
        <BalanceRow key={child.id} acc={child} level={level + 1} expandedMap={expandedMap} toggle={toggle} />
      ))}
    </>
  );
};

/* ===================== MAIN COMPONENT ===================== */
export default function BalanceSheet() {
  const { selectedBranchId } = useSelector((state) => state.user);
  const [expandedMap, setExpandedMap] = useState({});
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data, isLoading, isError } = useGetBalanceSheetQuery({
    branchId: selectedBranchId,
    start: `${startDate}T00:00:00`,
    end: `${endDate}T23:59:59`,
  });

  useEffect(() => {
    if (data) {
      setExpandedMap({
        ...initializeExpandedMap(data.assets || []),
        ...initializeExpandedMap(data.liabilities || []),
        ...initializeExpandedMap(data.equity || []),
      });
    }
  }, [data]);

  const { assets, liabilities, equity, assetsTotal, liabEquityTotal, isBalanced } = useMemo(() => {
    const a = data?.assets || [];
    const l = data?.liabilities || [];
    const e = data?.equity || [];
    const aT = a.reduce((s, x) => s + computeTotal(x), 0);
    const lT = l.reduce((s, x) => s + computeTotal(x), 0);
    const eT = e.reduce((s, x) => s + computeTotal(x), 0);
    return {
      assets: a,
      liabilities: l,
      equity: e,
      assetsTotal: aT,
      liabEquityTotal: lT + eT,
      isBalanced: Math.abs(aT - (lT + eT)) < 0.01
    };
  }, [data]);

  if (isError) return <div className="p-10 text-center text-rose-500">Failed to load financial data.</div>;

  const toggle = (id) => setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <ContentLayout loadingSpinner={isLoading} title="Balance Sheet" subTitle="Statement of Financial Position">
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-xl border">
            <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-sm border-none focus:ring-0" />
            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-sm border-none focus:ring-0" />
          </div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all",
            isBalanced ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600" : "bg-rose-500/10 border-rose-500/50 text-rose-600"
          )}>
            {isBalanced ? <ShieldCheck className="h-4 w-4" /> : <AlertCircle className="h-4 w-4 animate-pulse" />}
            {isBalanced ? "Accounts Balanced" : "Out of Balance"}
          </div>
        </div>

        {/* SUMMARY TILES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-indigo-600 text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute right-[-10%] top-[-20%] opacity-10"><Scale size={160} /></div>
            <CardContent className="p-6 relative">
              <p className="text-indigo-100 text-xs font-black uppercase tracking-widest">Total Assets</p>
              <h2 className="text-4xl font-black mt-2">{formatCurrency(assetsTotal)}</h2>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute right-[-10%] top-[-20%] opacity-10"><PieChart size={160} /></div>
            <CardContent className="p-6 relative">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Liabilities + Equity</p>
              <h2 className="text-4xl font-black mt-2">{formatCurrency(liabEquityTotal)}</h2>
            </CardContent>
          </Card>
        </div>

        {/* DATA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: ASSETS */}
          <div className="space-y-6">
            <SectionBlock title="Current & Fixed Assets" accounts={assets} total={assetsTotal} expandedMap={expandedMap} toggle={toggle} accent="indigo" />
          </div>

          {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
          <div className="space-y-6">
            <SectionBlock title="Liabilities" accounts={liabilities} total={liabilities.reduce((s,x)=>s+computeTotal(x),0)} expandedMap={expandedMap} toggle={toggle} accent="rose" />
            <SectionBlock title="Equity" accounts={equity} total={equity.reduce((s,x)=>s+computeTotal(x),0)} expandedMap={expandedMap} toggle={toggle} accent="amber" />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

const SectionBlock = ({ title, accounts, total, expandedMap, toggle, accent }) => (
  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
    <div className={cn("px-5 py-4 border-b border-border flex justify-between items-center bg-muted/20")}>
      <h3 className="font-black text-xs uppercase tracking-widest text-foreground flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", {
          "bg-indigo-500": accent === "indigo",
          "bg-rose-500": accent === "rose",
          "bg-amber-500": accent === "amber",
        })} />
        {title}
      </h3>
      <span className="text-sm font-bold">{formatCurrency(total)}</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-muted/10 border-b border-border">
          <tr className="text-[10px] uppercase text-muted-foreground font-bold">
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3 text-right">Balance</th>
            <th className="px-4 py-3 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(acc => (
            <BalanceRow key={acc.id} acc={acc} level={0} expandedMap={expandedMap} toggle={toggle} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);