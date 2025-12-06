import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCustomerSummaryById } from "../../../../../../Redux Toolkit/features/customerSummary/customerSummaryThunks";

// Format LKR consistently
const formatLKR = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(value || 0);

const CustomerSummary = ({ customerId }) => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector(
    (state) => state.customerSummary
  );

  useEffect(() => {
    if (customerId) dispatch(getCustomerSummaryById(customerId));
  }, [dispatch, customerId]);

  if (loading) return <p className="text-sm">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">Error: {error}</p>;
  if (!summary) return <p className="text-sm">No summary available</p>;

  const metrics = [
    {
      label: "Orders",
      value: summary.totalAmount,
      sub: {
        cash: summary.totalCash,
        credit: summary.totalCredit,
      },
    },
    {
      label: "Refunds",
      value: summary.totalRefundAmount,
      sub: {
        cash: summary.totalRefundCash,
        credit: summary.totalRefundCredit,
      },
    },
    {
      label: "Payments",
      value: summary.totalPaymentAmount,
      sub: {
        cash: summary.totalPaymentCash,
        credit: summary.totalPaymentCredit,
      },
    },
  ];

  return (
    <div className="space-y-6">
     <pre>
      {/* {JSON.stringify(summary,null,2)} */}
      </pre> 
      <h2 className="text-xl font-bold">Customer Summary</h2>

      <Separator />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="border bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center">
                <span>{metric.label}</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatLKR(metric.value)}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 flex justify-between text-sm font-semibold">
              <p className="text-green-600">Cash: {formatLKR(metric.sub.cash)}</p>
              <p className="text-red-600">Credit: {formatLKR(metric.sub.credit)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerSummary;
