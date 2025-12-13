"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, Repeat, DollarSign } from "lucide-react";
import { useGetCustomerSummaryByIdQuery } from "@/Redux Toolkit/features/customer/customerSummaryApi";

// -------------------
// Helpers
// -------------------
const formatLKR = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(value || 0);

const formatNumber = (value) => value ?? 0;

// -------------------
// CustomerSummary Component
// -------------------
const CustomerSummary = ({ customerId,customer }) => {
  const { data: summary, isLoading, isError } = useGetCustomerSummaryByIdQuery(customerId, {
    skip: !customerId,
  });

  if (isLoading ) return null;
  if (isError) return <p className="text-red-500 text-sm">Failed to load summary</p>;
  if (!summary) return <p className="text-sm">No summary available</p>;

  // -------------------
  // Panels for total amounts
  // -------------------
  const panels = [
    {
      title: "Orders",
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      value: formatLKR(summary.totalAmount),
      details: [
        { label: "Cash", value: formatLKR(summary.totalCash), color: "text-green-600" },
        { label: "Credit", value: formatLKR(summary.totalCredit), color: "text-red-600" },
      ],
      bg: "bg-blue-500",
    },
    {
      title: "Refunds",
      icon: <Repeat className="w-6 h-6 text-white" />,
      value: formatLKR(summary.totalRefundAmount),
      details: [
        { label: "Cash", value: formatLKR(summary.totalRefundCash), color: "text-green-600" },
        { label: "Credit", value: formatLKR(summary.totalRefundCredit), color: "text-red-600" },
      ],
      bg: "bg-yellow-500",
    },
    {
      title: "Payments",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      value: formatLKR(summary.totalPaymentAmount),
      details: [
        { label: "Cash", value: formatLKR(summary.totalPaymentCash), color: "text-green-600" },
        { label: "Credit", value: formatLKR(summary.totalPaymentCredit), color: "text-red-600" },
      ],
      bg: "bg-indigo-500",
    },
  ];

  // -------------------
  // Count Panels
  // -------------------
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
if (customer?.id!==summary?.customer?.id)  return "Loading..."
  return (
    <div className="space-y-8">
      {/* {JSON.stringify(summary?.customer?.id)}
      {JSON.stringify(customer?.id!==summary?.customer?.id?"loading":'NL')} */}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center">
        {/* <h1 className="text-2xl font-bold">{summary.customer.fullName}</h1> */}
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
                <p key={d.label} className={`text-sm font-medium ${d.color}`}>
                  {d.label}: {d.value}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Count Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
