import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign, Store, ShoppingCart, Users } from "lucide-react";
import { getStoreOverview } from "@/Redux Toolkit/features/storeAnalytics/storeAnalyticsThunks";
import { useToast } from "@/components/ui/use-toast";

const DashboardStats = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { storeOverview, loading } = useSelector(
    (state) => state.storeAnalytics
  );
  const { userProfile } = useSelector((state) => state.user);

  useEffect(() => {
    if (userProfile?.id) fetchStoreOverview();
  }, [userProfile]);

  const fetchStoreOverview = async () => {
    try {
      await dispatch(getStoreOverview(userProfile.id)).unwrap();
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to fetch store overview",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const formatChange = (current, previous) => {
    if (!previous) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(1)}%`;
  };

  const stats = [
    {
      title: "Revenue",
      value: formatCurrency(storeOverview?.totalSales),
      icon: DollarSign,
      change: formatChange(
        storeOverview?.totalSales,
        storeOverview?.previousPeriodSales
      ),
    },
    {
      title: "Branches",
      value: storeOverview?.totalBranches || 0,
      icon: Store,
      change: formatChange(
        storeOverview?.totalBranches,
        storeOverview?.previousPeriodBranches
      ),
    },
    {
      title: "Products",
      value: storeOverview?.totalProducts || 0,
      icon: ShoppingCart,
      change: formatChange(
        storeOverview?.totalProducts,
        storeOverview?.previousPeriodProducts
      ),
    },
    {
      title: "Employees",
      value: storeOverview?.totalEmployees || 0,
      icon: Users,
      change: formatChange(
        storeOverview?.totalEmployees,
        storeOverview?.previousPeriodEmployees
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const positive = stat.change.startsWith("▲");

        return (
          <div
            key={index}
            className="
              relative
              p-6
              rounded-xl
              bg-gray-100 dark:bg-[#0F172A]
              border border-gray-200 dark:border-gray-800
              hover:bg-gray-200/70 dark:hover:bg-[#111827]
              transition-colors
            "
          >
            {/* Icon */}
            <div className="absolute top-4 right-4 opacity-10">
              <Icon className="w-16 h-16" />
            </div>

            {/* Content */}
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {stat.title}
            </p>

            <h2 className="text-2xl font-extrabold mt-3 tracking-tight">
              {loading ? (
                <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </h2>

            <div
              className={`inline-flex items-center mt-4 px-3 py-1 rounded-full text-xs font-semibold ${
                positive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {loading ? (
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                `${stat.change} MoM`
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
