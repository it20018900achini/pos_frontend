"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayOverview } from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, Repeat, ShoppingBag, Users, 
  Package, ClipboardCheck, TrendingUp, TrendingDown,
  ArrowUpRight, Activity
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
      color: "indigo",
      growth: todayOverview?.salesGrowth,
    },
    {
      title: "Order Volume",
      value: todayOverview?.ordersToday,
      formatted: todayOverview?.ordersToday?.toLocaleString() || "0",
      icon: ShoppingBag,
      color: "blue",
      growth: todayOverview?.orderGrowth,
    },
    {
      title: "Refund Value",
      value: todayOverview?.todayRefunds,
      formatted: todayOverview?.todayRefunds ? `LKR ${todayOverview.todayRefunds.toLocaleString()}` : "0.00",
      icon: Repeat,
      color: "rose",
      growth: todayOverview?.refundGrowth,
    },
    {
      title: "Active Cashiers",
      value: todayOverview?.activeCashiers,
      formatted: todayOverview?.activeCashiers || "0",
      icon: Users,
      color: "amber",
      growth: todayOverview?.cashierGrowth,
    },
    {
      title: "Stock Alerts",
      value: todayOverview?.lowStockItems,
      formatted: todayOverview?.lowStockItems || "0",
      icon: Package,
      color: "orange",
      growth: todayOverview?.lowStockGrowth,
    },
    {
      title: "Return Count",
      value: todayOverview?.todayRefundCount,
      formatted: todayOverview?.todayRefundCount || "0",
      icon: ClipboardCheck,
      color: "emerald",
      growth: todayOverview?.todayRefundCount - (todayOverview?.yesterdayRefundCount ?? 0),
    },
  ], [todayOverview]);

  if (loading) return <LoadingGrid />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {kpis.map((kpi, idx) => (
          <KPICard key={kpi.title} kpi={kpi} index={idx} />
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- PRO KPI CARD ---------------- */

const KPICard = ({ kpi, index }) => {
  const Icon = kpi.icon;
  const isPositive = kpi.growth >= 0;

  // Premium color system mapping
  const themes = {
    indigo: "from-indigo-500/10 to-blue-500/10 text-indigo-600 border-indigo-100 dark:border-indigo-500/20",
    blue: "from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-100 dark:border-blue-500/20",
    rose: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-100 dark:border-rose-500/20",
    amber: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100 dark:border-amber-500/20",
    orange: "from-orange-500/10 to-red-500/10 text-orange-600 border-orange-100 dark:border-orange-500/20",
    emerald: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="bg-white"
    >
      <Card className="group relative overflow-hidden p-6 rounded-[2.5rem] border-none bg-white dark:bg-neutral-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
        
        {/* Subtle Background Accent */}
        <div className={cn(
          "absolute -right-6 -top-6 w-32 h-32 blur-[60px] opacity-30 rounded-full bg-gradient-to-br",
          themes[kpi.color].split('text')[0]
        )} />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <div className={cn("p-2 rounded-xl bg-gradient-to-br", themes[kpi.color].split('text')[0])}>
                    <Icon size={18} className="stroke-[2.5px]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    {kpi.title}
                  </span>
               </div>
               <h3 className="text-3xl font-black tracking-tight pt-3 text-neutral-900 dark:text-neutral-50">
                 {kpi.formatted}
               </h3>
            </div>
            
            {/* Visual Spark-indicator */}
            <div className="flex flex-col items-end gap-1">
               <div className={cn(
                 "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tighter shadow-sm",
                 isPositive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
               )}>
                 {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                 {Math.abs(kpi.growth || 0).toFixed(1)}%
               </div>
            </div>
          </div>

          {/* Bottom Bar: Trend Decoration */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="flex -space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={cn(
                      "w-1.5 h-6 rounded-full opacity-20", 
                      isPositive ? "bg-emerald-400" : "bg-rose-400"
                    )} 
                    style={{ height: `${20 + (Math.random() * 80)}%` }}
                    />
                  ))}
               </div>
               <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1 uppercase">
                 <Activity size={10} /> Real-time 
               </span>
            </div>
            <ArrowUpRight size={16} className="text-neutral-300 group-hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/* ---------------- SKELETON LOADER ---------------- */

const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="p-8 rounded-[2.5rem] space-y-6 border-none bg-neutral-50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </Card>
    ))}
  </div>
);

export default TodayOverview;