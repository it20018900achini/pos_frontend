import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  RefreshCcw,
  Package
} from "lucide-react";
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

  // Define default date range (Current month)
  const dateRange = useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      start: firstDay.toISOString(),
      end: now.toISOString(),
    };
  }, []);

  useEffect(() => {
    if (storeId && storeId !== "undefined") {
      dispatch(getStoreOverview({ 
        storeId: storeId, 
        start: dateRange.start, 
        end: dateRange.end 
      }));
    }
  }, [storeId, dateRange, dispatch]);

  const statsConfig = useMemo(() => {
    if (!storeOverview) return [];
    
    // Mapping strictly to your JSON object keys
    return [
      { 
        title: "Total Revenue", 
        raw: storeOverview.totalSales, 
        prev: storeOverview.previousPeriodSales || 0, 
        icon: DollarSign, 
        color: "blue", 
        isCurrency: true 
      },
      { 
        title: "Total Orders", 
        raw: storeOverview.totalOrders, 
        prev: storeOverview.previousPeriodOrders || 0, 
        icon: ShoppingCart, 
        color: "violet" 
      },
      { 
        title: "Total Customers", 
        raw: storeOverview.totalCustomers, 
        prev: 0, 
        icon: Users, 
        color: "emerald" 
      },
      { 
        title: "Store Refunds", 
        raw: storeOverview.totalRefunds, 
        prev: storeOverview.previousPeriodRefunds || 0, 
        icon: RefreshCcw, 
        color: "amber" 
      },
    ];
  }, [storeOverview]);

  if (loading) return <SkeletonLoader />;
  if (!storeOverview) return null;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Optional: Secondary Mini-Stats for branches/products */}
      <div className="flex flex-wrap gap-4 pt-2">
         <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 flex items-center gap-2">
            <Package size={14} /> {storeOverview.totalProducts} Products
         </div>
         <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 flex items-center gap-2">
            <Users size={14} /> {storeOverview.totalEmployees} Employees
         </div>
         {storeOverview.topBranchName && (
            <div className="px-4 py-2 bg-blue-500/10 text-blue-600 rounded-xl text-xs font-bold flex items-center gap-2">
               ⭐ Top Branch: {storeOverview.topBranchName}
            </div>
         )}
      </div>
    </div>
  );
};

// --- Sub-components ---

const StatCard = ({ stat, index }) => {
  const { percent, isPositive } = calculateTrend(stat.raw, stat.prev);
  const Icon = stat.icon;

  const colorMap = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 rounded-2xl ${colorMap[stat.color]}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        
        {/* Trend logic: Don't show if previous is 0 to avoid messy UI on empty stats */}
        {stat.prev > 0 && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
          }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {percent}%
          </div>
        )}
      </div>

      <p className="text-[11px] uppercase tracking-widest font-black text-slate-400">
        {stat.title}
      </p>
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