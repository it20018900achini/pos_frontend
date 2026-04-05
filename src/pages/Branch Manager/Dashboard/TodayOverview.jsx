"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayOverview } from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, Repeat, Users, 
  Package, ShieldCheck, TrendingUp, TrendingDown,
  Zap, Activity
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
      formatted: todayOverview?.totalSales ? `LKR ${todayOverview.totalSales.toLocaleString()}` : "0.00",
      icon: DollarSign,
      color: "blue",
      growth: todayOverview?.salesGrowth,
      status: "Live Sync"
    },
    {
      title: "Order Volume",
      formatted: todayOverview?.ordersToday?.toLocaleString() || "0",
      icon: Zap,
      color: "violet",
      growth: todayOverview?.orderGrowth,
      status: "12/hr avg"
    },
    {
      title: "Refund Value",
      formatted: todayOverview?.todayRefunds ? `LKR ${todayOverview.todayRefunds.toLocaleString()}` : "0.00",
      icon: Repeat,
      color: "rose",
      growth: todayOverview?.refundGrowth,
      status: `${todayOverview?.todayRefundCount || 0} items`
    },
    {
      title: "Team Status",
      formatted: todayOverview?.activeCashiers || "0",
      icon: Users,
      color: "amber",
      growth: todayOverview?.cashierGrowth,
      status: "Terminals"
    },
    {
      title: "Stock Health",
      formatted: todayOverview?.lowStockItems || "0",
      icon: Package,
      color: "emerald",
      growth: todayOverview?.lowStockGrowth,
      status: "Critical"
    },
    {
      title: "System Integrity",
      formatted: "Optimal",
      icon: ShieldCheck,
      color: "cyan",
      growth: 0,
      status: "Active"
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

/* ---------------- ULTRA MINIMALIST PRO CARD (NO BOTTOM) ---------------- */

const KPICard = ({ kpi, index }) => {
  const Icon = kpi.icon;
  const isPositive = kpi.growth >= 0;

  const themes = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    rose: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    cyan: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white p-7 transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:border-white/5 dark:bg-neutral-950">
        
        {/* Top Branding/Status Row */}
        <div className="flex items-center justify-between mb-8">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-110",
            themes[kpi.color]
          )}>
            <Icon size={24} strokeWidth={1.5} />
          </div>

          <div className="flex flex-col items-end">
            <div className={cn(
              "flex items-center gap-1 font-black text-[12px] tracking-tight",
              isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(kpi.growth || 0).toFixed(1)}%
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{kpi.status}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-1">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-500 transition-colors">
            {kpi.title}
          </p>
          <div className="flex items-center gap-3">
             <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
               {kpi.formatted}
             </h3>
             {isPositive && (
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             )}
          </div>
        </div>

        {/* Subtle Background Interaction Effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none",
          themes[kpi.color].split(' ')[0]
        )} />
      </Card>
    </motion.div>
  );
};

/* ---------------- COMPACT SKELETON ---------------- */

const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="h-[180px] rounded-[2rem] border-none bg-slate-50 p-7 dark:bg-neutral-900">
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