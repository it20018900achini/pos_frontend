"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerSummaryById } from "../../../../../../Redux Toolkit/features/customerSummary/customerSummaryThunks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Package, Repeat, DollarSign } from "lucide-react";

// Format currency
const formatLKR = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(value || 0);

// Format numbers
const formatNumber = (value) => value ?? 0;

const CustomerSummary = ({ customerId }) => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.customerSummary);

  useEffect(() => {
    if (customerId) dispatch(getCustomerSummaryById(customerId));
  }, [dispatch, customerId]);

  // --------------------------
  // Skeleton
  // --------------------------
  if (loading)
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-6 w-1/4 rounded-full" />
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-28 rounded-xl w-full" />
        ))}
      </div>
    );

  if (error) return <p className="text-sm text-red-500">Error: {error}</p>;
  if (!summary) return <p className="text-sm">No summary available</p>;

  // --------------------------
  // Cards config
  // --------------------------
  const panels = [
    {
      title: "Orders",
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      value: formatLKR(summary.totalAmount),
      details: [
        { label: "Cash", value: formatLKR(summary.totalCash), color: "green" },
        { label: "Credit", value: formatLKR(summary.totalCredit), color: "red" },
      ],
      bg: "bg-blue-500",
    },
    {
      title: "Refunds",
      icon: <Repeat className="w-6 h-6 text-white" />,
      value: formatLKR(summary.totalRefundAmount),
      details: [
        { label: "Cash", value: formatLKR(summary.totalRefundCash), color: "green" },
        { label: "Credit", value: formatLKR(summary.totalRefundCredit), color: "red" },
      ],
      bg: "bg-yellow-500",
    },
    {
      title: "Payments",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      value: formatLKR(summary.totalPaymentAmount),
      details: [
        { label: "Cash", value: formatLKR(summary.totalPaymentCash), color: "green" },
        { label: "Credit", value: formatLKR(summary.totalPaymentCredit), color: "red" },
      ],
      bg: "bg-green-500",
    },
  ];

  const counts = [
    {
      label: "Total Orders",
      value: formatNumber(summary.totalOrders),
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      bg: "bg-indigo-500",
    },
    {
      label: "Order Items",
      value: formatNumber(summary.totalOrderItems),
      icon: <Package className="w-5 h-5 text-white" />,
      bg: "bg-purple-500",
    },
    {
      label: "Refunds",
      value: formatNumber(summary.totalRefunds),
      icon: <Repeat className="w-5 h-5 text-white" />,
      bg: "bg-orange-500",
    },
    {
      label: "Refund Items",
      value: formatNumber(summary.totalRefundItems),
      icon: <Package className="w-5 h-5 text-white" />,
      bg: "bg-red-500",
    },
  ];

  // --------------------------
  // Render
  // --------------------------
  return (
    <div className="space-y-8">
      {/* Customer Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">{summary.customer.fullName}</h1>
        <p className="text-sm text-gray-500 mt-2 md:mt-0">Customer Dashboard Overview</p>
      </div>

      {/* Amount Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {panels.map((panel) => (
          <Card key={panel.title} className="shadow-lg rounded-xl overflow-hidden">
            <div className={`p-5 flex items-center space-x-4 ${panel.bg}`}>
              <div className="p-3 rounded-full bg-white/25">{panel.icon}</div>
              <div>
                <h3 className="text-white font-semibold">{panel.title}</h3>
                <p className="text-white text-xl font-bold mt-1">{panel.value}</p>
              </div>
            </div>
            <CardContent className="bg-gray-50 flex justify-between p-4">
              {panel.details.map((d) => (
                <p key={d.label} className={`text-sm font-medium text-${d.color}-600`}>
                  {d.label}: {d.value}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Count Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {counts.map((c) => (
          <Card
            key={c.label}
            className="flex items-center p-4 space-x-4 shadow-md hover:shadow-lg transition rounded-xl"
          >
            <div className={`p-3 rounded-full ${c.bg}`}>{c.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <h3 className="text-xl font-bold">{c.value}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerSummary;
