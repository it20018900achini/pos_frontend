import React, { useState, useEffect } from "react";
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

const TodayOverview = () => {
  const dispatch = useDispatch();
  const { todayOverview, loading } = useSelector(
    (state) => state.branchAnalytics
  );

  const branchId = 52;

  // ------------------------
  // Helper: format YYYY-MM-DD
  // ------------------------
  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday = 0

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  // ------------------------
  // State
  // ------------------------
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [preset, setPreset] = useState("today");

  // ------------------------
  // Handle preset change
  // ------------------------
  const handlePresetChange = (value) => {
    setPreset(value);
    switch (value) {
      case "today":
        setStartDate(formatDate(today));
        setEndDate(formatDate(today));
        break;
      case "yesterday":
        setStartDate(formatDate(yesterday));
        setEndDate(formatDate(yesterday));
        break;
      case "thisWeek":
        setStartDate(formatDate(weekStart));
        setEndDate(formatDate(today));
        break;
      case "thisMonth":
        setStartDate(formatDate(monthStart));
        setEndDate(formatDate(today));
        break;
      case "thisYear":
        setStartDate(formatDate(yearStart));
        setEndDate(formatDate(today));
        break;
    }
  };

  // ------------------------
  // Fetch overview
  // ------------------------
  useEffect(() => {
    dispatch(getTodayOverview({ branchId, start: startDate, end: endDate }));
  }, [branchId, startDate, endDate, dispatch]);

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

  const kpis = [
    {
      title: "Today's Sales",
      value: todayOverview?.totalSales,
      formatted: todayOverview?.totalSales
        ? `LKR ${todayOverview.totalSales.toLocaleString()}`
        : "-",
      icon: DollarSign,
      gradient: "bg-gradient-to-tr from-green-400 to-teal-400",
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

  const SkeletonCard = ({ large = false }) => (
    <Card
      className={`rounded-xl shadow-md animate-pulse ${
        large ? "h-56" : "h-40"
      }`}
    >
      <CardContent className="p-5 flex justify-between items-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton
            className={`h-10 ${large ? "w-48" : "w-32"} rounded-md`}
          />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* -------------------------------
          Preset Dropdown
      ------------------------------- */}

      {/* Manual Date Inputs */}
      <div className="flex gap-4 mb-4 items-center justify-end w-full">
        
      <div >
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Quick Range
        </label>
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="p-2 rounded-md border border-gray-300 w-40"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
            <SkeletonCard large />
            <SkeletonCard large />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:col-span-2">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
            {kpis.slice(0, 2).map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <Card
                  key={idx}
                  className="rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 animate-fade-in"
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

          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:col-span-2">
            {kpis.slice(2).map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <Card
                  key={idx}
                  className="rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 animate-fade-in"
                >
                  <CardContent className="p-5 flex justify-between items-center">
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
                    <div
                      className={`p-4 rounded-full ${kpi.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default TodayOverview;
