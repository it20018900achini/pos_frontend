import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { DollarSign, Store, ShoppingCart, Users, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { getStoreOverview } from "../../../Redux Toolkit/features/storeAnalytics/storeAnalyticsThunks";

// Helper for currency formatting
const formatLKR = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

// Helper for trend calculation
const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return { percent: "0.0", isPositive: true };
  const diff = ((current - previous) / previous) * 100;
  return {
    percent: Math.abs(diff).toFixed(1),
    isPositive: diff >= 0,
  };
};

const DashboardStats = () => {
  const dispatch = useDispatch();
  const { storeOverview, loading } = useSelector((state) => state.storeAnalytics);
  const { userProfile } = useSelector((state) => state.user);

    const storeId = userProfile?.user?.store?.id;
  useEffect(() => {
    if (storeId) dispatch(getStoreOverview(storeId));
  }, [storeId, dispatch]);

  // Memoizing config to prevent unnecessary re-renders
  const statsConfig = useMemo(() => {
    if (!storeOverview) return [];
    return [
      { title: "Total Revenue", raw: storeOverview.totalSales, prev: storeOverview.previousPeriodSales, icon: DollarSign, color: "blue", isCurrency: true },
      { title: "Active Branches", raw: storeOverview.totalBranches, prev: storeOverview.previousPeriodBranches, icon: Store, color: "emerald" },
      { title: "Inventory Size", raw: storeOverview.totalProducts, prev: storeOverview.previousPeriodProducts, icon: ShoppingCart, color: "violet" },
      { title: "Workforce", raw: storeOverview.totalEmployees, prev: storeOverview.previousPeriodEmployees, icon: Users, color: "amber" },
    ];
  }, [storeOverview]);

  if (!storeOverview || loading) return <SkeletonLoader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <StatCard key={stat.title} stat={stat} index={index} />
      ))}
    </div>
  );
};

// Sub-component for clarity
const StatCard = ({ stat, index }) => {
  const { percent, isPositive } = calculateTrend(stat.raw, stat.prev);
  const Icon = stat.icon;

  // Tailwind dynamic classes (Note: ensure these aren't purged by adding to safelist if necessary)
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-emerald-500",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-violet-500",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-amber-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 rounded-2xl ${colorMap[stat.color].split(' shadow')[0]}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {percent}%
        </div>
      </div>

      <p className="text-[11px] uppercase tracking-widest font-black text-slate-400">{stat.title}</p>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
        {stat.isCurrency ? formatLKR(stat.raw) : stat.raw || 0}
      </h2>
    </motion.div>
  );
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-40 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    ))}
  </div>
);

export default DashboardStats;