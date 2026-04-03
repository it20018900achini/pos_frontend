"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayOverview } from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, Repeat, ShoppingBag, Users, 
  Package, ShieldCheck, TrendingUp, TrendingDown,
  ArrowUpRight, Zap, Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const TodayOverview = ({ selectedBranchId, startDate, endDate }) => {
  const dispatch = useDispatch();
  const { todayOverview, loading } = useSelector((state) => state.branchAnalytics);

  useEffect(() => {
    if (!selectedBranchId || !startDate || !endDate) return;
    dispatch(getTodayOverview({ 
      branchId: selectedBranchId, 
      start: startDate, 
      end: endDate 
    }));
  }, [selectedBranchId, startDate, endDate, dispatch]);

  const kpis = useMemo(() => [
    {
      title: "Gross Revenue",
      value: todayOverview?.totalSales,
      formatted: todayOverview?.totalSales ? `LKR ${todayOverview.totalSales.toLocaleString()}` : "0.00",
      icon: DollarSign,
      color: "blue",
      growth: todayOverview?.salesGrowth,
      subValue: "Daily Target: 85%"
    },
    {
      title: "Order Volume",
      value: todayOverview?.ordersToday,
      formatted: todayOverview?.ordersToday?.toLocaleString() || "0",
      icon: Zap,
      color: "violet",
      growth: todayOverview?.orderGrowth,
      subValue: "Avg. 12/hour"
    },
    {
      title: "Refund Value",
      value: todayOverview?.todayRefunds,
      formatted: todayOverview?.todayRefunds ? `LKR ${todayOverview.todayRefunds.toLocaleString()}` : "0.00",
      icon: Repeat,
      color: "rose",
      growth: todayOverview?.refundGrowth,
      subValue: `${todayOverview?.todayRefundCount || 0} items returned`
    },
    {
      title: "Team Status",
      value: todayOverview?.activeCashiers,
      formatted: todayOverview?.activeCashiers || "0",
      icon: Users,
      color: "amber",
      growth: todayOverview?.cashierGrowth,
      subValue: "Active Terminals"
    },
    {
      title: "Stock Health",
      value: todayOverview?.lowStockItems,
      formatted: todayOverview?.lowStockItems || "0",
      icon: Package,
      color: "emerald",
      growth: todayOverview?.lowStockGrowth,
      subValue: "Action Required"
    },
    {
      title: "System Integrity",
      value: 100,
      formatted: "Optimal",
      icon: ShieldCheck,
      color: "cyan",
      growth: 0,
      subValue: "All Nodes Active"
    },
  ], [todayOverview]);

  if (loading) return <LoadingGrid />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {kpis.map((kpi, idx) => (
          <KPICard key={kpi.title} kpi={kpi} index={idx} />
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- PRO MINIMALIST CARD ---------------- */

const KPICard = ({ kpi, index }) => {
  const Icon = kpi.icon;
  const isPositive = kpi.growth >= 0;

  const themes = {
    blue: "from-blue-600 to-blue-400 bg-blue-500/10 text-blue-600 shadow-blue-500/5",
    violet: "from-violet-600 to-indigo-400 bg-violet-500/10 text-violet-600 shadow-violet-500/5",
    rose: "from-rose-600 to-pink-400 bg-rose-500/10 text-rose-600 shadow-rose-500/5",
    amber: "from-amber-500 to-orange-400 bg-amber-500/10 text-amber-600 shadow-amber-500/5",
    emerald: "from-emerald-600 to-teal-400 bg-emerald-500/10 text-emerald-600 shadow-emerald-500/5",
    cyan: "from-cyan-600 to-blue-400 bg-cyan-500/10 text-cyan-600 shadow-cyan-500/5",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/50 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:border-white/5 dark:bg-neutral-950">
        
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-6",
            themes[kpi.color].split(' shadow')[0]
          )}>
            <Icon size={24} strokeWidth={2} />
          </div>

          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black tracking-tight",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(kpi.growth || 0).toFixed(1)}%
          </div>
        </div>

        {/* Center Content */}
        <div className="mt-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {kpi.title}
          </span>
          <h3 className="mt-1 text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            {kpi.formatted}
          </h3>
        </div>

        {/* Footer Section - Replaced Live Feed with Data Details */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-5 dark:border-white/5">
          <div className="flex items-center gap-2 text-slate-400">
            <Target size={14} className="text-slate-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{kpi.subValue}</span>
          </div>
          
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-white/5">
             <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Glass Glow effect */}
        <div className={cn(
          "absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20",
          themes[kpi.color].split(' shadow')[0]
        )} />
      </Card>
    </motion.div>
  );
};

/* ---------------- SKELETON LOADER ---------------- */

const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="h-[240px] rounded-[2.5rem] border-none bg-slate-50 p-8 dark:bg-neutral-900">
        <div className="flex justify-between">
           <Skeleton className="h-12 w-12 rounded-2xl" />
           <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-8 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    ))}
  </div>
);

export default TodayOverview;