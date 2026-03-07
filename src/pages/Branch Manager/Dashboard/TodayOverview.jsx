import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getChangeType } from "../data";
import { getTodayOverview } from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DollarSign,
  Repeat,
  ShoppingBag,
  Users,
  Package,
  ClipboardCheck,
} from "lucide-react";

const TodayOverview = ({selectedBranchId, startDate, endDate }) => {

  const dispatch = useDispatch();

  // const { selectedBranchId } = useSelector((state) => state.user);

  const { todayOverview, loading } = useSelector(
    (state) => state.branchAnalytics
  );

  const branchId = selectedBranchId;

  /* ---------------- API Call ---------------- */

  useEffect(() => {
    if (!branchId || !startDate || !endDate) return;

    dispatch(
      getTodayOverview({
        branchId,
        start: startDate,
        end: endDate,
      })
    );
  }, [branchId, startDate, endDate, dispatch]);

  /* ---------------- Helpers ---------------- */

  const formatPercent = (num) => {
    if (num === undefined || num === null) return "-";
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(2)}%`;
  };

  const getChangeColor = (type) => {
    switch (type) {
      case "positive":
        return "text-emerald-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  /* ---------------- KPI DATA ---------------- */

  const kpis = [
    {
      title: "Today's Sales",
      value: todayOverview?.totalSales,
      formatted: todayOverview?.totalSales
        ? `LKR ${todayOverview.totalSales.toLocaleString()}`
        : "-",
      icon: DollarSign,
      gradient: "bg-gradient-to-tr from-indigo-400 to-teal-400",
      change: formatPercent(todayOverview?.salesGrowth),
      changeType: getChangeType(todayOverview?.salesGrowth),
    },
    {
      title: "Refunds Today",
      value: todayOverview?.todayRefunds,
      formatted: todayOverview?.todayRefunds
        ? `LKR ${todayOverview.todayRefunds.toLocaleString()}`
        : "-",
      icon: Repeat,
      gradient: "bg-gradient-to-tr from-yellow-400 to-pink-400",
      change: formatPercent(todayOverview?.refundGrowth),
      changeType: getChangeType(todayOverview?.refundGrowth),
    },
    {
      title: "Orders Today",
      value: todayOverview?.ordersToday,
      formatted: todayOverview?.ordersToday ?? "-",
      icon: ShoppingBag,
      gradient: "bg-gradient-to-tr from-blue-400 to-indigo-400",
      change: formatPercent(todayOverview?.orderGrowth),
      changeType: getChangeType(todayOverview?.orderGrowth),
    },
    {
      title: "Active Cashiers",
      value: todayOverview?.activeCashiers,
      formatted: todayOverview?.activeCashiers ?? "-",
      icon: Users,
      gradient: "bg-gradient-to-tr from-purple-400 to-pink-400",
      change: formatPercent(todayOverview?.cashierGrowth),
      changeType: getChangeType(todayOverview?.cashierGrowth),
    },
    {
      title: "Low Stock Items",
      value: todayOverview?.lowStockItems,
      formatted: todayOverview?.lowStockItems ?? "-",
      icon: Package,
      gradient: "bg-gradient-to-tr from-red-400 to-orange-400",
      change: formatPercent(todayOverview?.lowStockGrowth),
      changeType: getChangeType(todayOverview?.lowStockGrowth),
    },
    {
      title: "Refund Count",
      value: todayOverview?.todayRefundCount,
      formatted: todayOverview?.todayRefundCount ?? "-",
      icon: ClipboardCheck,
      gradient: "bg-gradient-to-tr from-yellow-400 to-amber-400",
      change: formatPercent(
        todayOverview?.todayRefundCount -
          (todayOverview?.yesterdayRefundCount ?? 0)
      ),
      changeType: getChangeType(
        todayOverview?.todayRefundCount -
          (todayOverview?.yesterdayRefundCount ?? 0)
      ),
    },
  ];

  /* ---------------- Skeleton Card ---------------- */

  const SkeletonCard = () => (
    <Card className="rounded-xl shadow-md h-40 animate-pulse">
      <CardContent className="p-5 flex justify-between items-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </CardContent>
    </Card>
  );

  /* ---------------- UI ---------------- */

  return loading ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;

        return (
          <Card
            key={idx}
            className="rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {kpi.title}
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  {kpi.formatted}
                </h3>

                <p
                  className={`text-sm mt-1 font-medium ${getChangeColor(
                    kpi.changeType
                  )}`}
                >
                  {kpi.change}
                </p>
              </div>

              <div
                className={`p-5 rounded-full ${kpi.gradient} flex items-center justify-center`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TodayOverview;