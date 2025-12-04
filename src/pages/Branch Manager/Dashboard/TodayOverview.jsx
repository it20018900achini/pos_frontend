import React from "react";
import { useSelector } from "react-redux";
import { getChangeType } from "../data";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
} from "lucide-react";

const TodayOverview = () => {
  const { todayOverview, loading } = useSelector(
    (state) => state.branchAnalytics
  );

  const formatPercent = (num) => {
    if (num === undefined || num === null) return "-";
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(2)}%`;
  };

  const kpis = [
    {
      title: "Today's Sales",
      value: todayOverview?.totalSales,
      formatted: todayOverview?.totalSales
        ? `LKR ${todayOverview.totalSales.toLocaleString()}`
        : "-",
      icon: DollarSign,
      change: formatPercent(todayOverview?.salesGrowth),
      changeType: getChangeType(todayOverview?.salesGrowth),
    },
    {
      title: "Orders Today",
      value: todayOverview?.ordersToday,
      formatted: todayOverview?.ordersToday ?? "-",
      icon: ShoppingBag,
      change: formatPercent(todayOverview?.orderGrowth),
      changeType: getChangeType(todayOverview?.orderGrowth),
    },
    {
      title: "Active Cashiers",
      value: todayOverview?.activeCashiers,
      formatted: todayOverview?.activeCashiers ?? "-",
      icon: Users,
      change: formatPercent(todayOverview?.cashierGrowth),
      changeType: getChangeType(todayOverview?.cashierGrowth),
    },
    {
      title: "Low Stock Items",
      value: todayOverview?.lowStockItems,
      formatted: todayOverview?.lowStockItems ?? "-",
      icon: Package,
      change: formatPercent(todayOverview?.lowStockGrowth),
      changeType: getChangeType(todayOverview?.lowStockGrowth),
    },
  ];

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

  // ----------------------
  // Skeleton Card
  // ----------------------
  const SkeletonCard = () => (
    <Card className="rounded-xl shadow-sm animate-fade-out">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-32 mt-3" />
            <Skeleton className="h-3 w-20 mt-3" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );

  // Calculate dynamic skeleton count based on screen
  const getSkeletonCount = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  };

  const skeletonCount = getSkeletonCount();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

      {/* Skeletons when loading */}
      {loading &&
        [...Array(skeletonCount)].map((_, idx) => <SkeletonCard key={idx} />)
      }

      {/* KPI Cards when not loading */}
      {!loading &&
        kpis.map((kpi, index) => {
          const Icon = kpi.icon;

          return (
            <Card
              key={index}
              className="rounded-xl shadow-sm hover:shadow-md transition animate-fade-in"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-muted-foreground">
                      {kpi.title}
                    </p>

                    <h3 className="text-xl font-semibold mt-1 tracking-tight">
                      {kpi.formatted}
                    </h3>

                    <p
                      className={`text-[12px] font-medium mt-1 ${getChangeColor(
                        kpi.changeType
                      )}`}
                    >
                      {kpi.change}
                    </p>
                  </div>

                  <div className="p-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      }

      {/* Show message only when not loading and no KPIs */}
      {!loading && !todayOverview && (
        <div className="col-span-4 text-center text-muted-foreground animate-fade-in">
          No data available
        </div>
      )}
    </div>
  );
};

export default TodayOverview;
