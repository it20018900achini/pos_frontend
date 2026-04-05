import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Store, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight
} from "lucide-react";
import { getStoreOverview } from "@/Redux Toolkit/features/storeAnalytics/storeAnalyticsThunks";
import { useToast } from "@/components/ui/use-toast";

const DashboardStats = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { storeOverview, loading } = useSelector((state) => state.storeAnalytics);
  const { userProfile } = useSelector((state) => state.user);

  useEffect(() => {
    if (userProfile?.user?.store?.id) {
      dispatch(getStoreOverview(userProfile.user.store.id)).unwrap().catch((err) => {
        toast({
          title: "Analytics Sync Failed",
          description: err || "Check your internet connection",
          variant: "destructive",
        });
      });
    }
  }, [userProfile, dispatch]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getTrendData = (current, previous) => {
    if (!previous || previous === 0) return { percent: "0.0", isPositive: true };
    const diff = ((current - previous) / previous) * 100;
    return {
      percent: Math.abs(diff).toFixed(1),
      isPositive: diff >= 0,
    };
  };

  const statsConfig = [
    {
      title: "Total Revenue",
      value: formatCurrency(storeOverview?.totalSales),
      prevValue: storeOverview?.previousPeriodSales,
      icon: DollarSign,
      color: "blue",
      description: "Gross store earnings"
    },
    {
      title: "Active Branches",
      value: storeOverview?.totalBranches || 0,
      prevValue: storeOverview?.previousPeriodBranches,
      icon: Store,
      color: "emerald",
      description: "Operational locations"
    },
    {
      title: "Inventory Size",
      value: storeOverview?.totalProducts || 0,
      prevValue: storeOverview?.previousPeriodProducts,
      icon: ShoppingCart,
      color: "violet",
      description: "Total unique SKUs"
    },
    {
      title: "Workforce",
      value: storeOverview?.totalEmployees || 0,
      prevValue: storeOverview?.previousPeriodEmployees,
      icon: Users,
      color: "amber",
      description: "Staff across all branches"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const trend = getTrendData(
          stat.title === "Total Revenue" ? storeOverview?.totalSales : parseInt(stat.value),
          stat.prevValue
        );

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Background Accent Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 rounded-full bg-${stat.color}-500 transition-opacity group-hover:opacity-20`} />

            <div className="flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                
                {/* Trend Badge */}
                {!loading && (
                  <div className={`flex items-center gap-1 text-xs font-bold ${
                    trend.isPositive ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend.percent}%
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                
                <div className="mt-1 flex items-baseline gap-2">
                  {loading ? (
                    <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {stat.value}
                    </h2>
                  )}
                </div>
                
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1 italic">
                  {stat.description}
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>

            {/* Bottom Progress Bar Decor */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-100 dark:bg-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full bg-${stat.color}-500/30`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;