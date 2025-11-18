import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getCustomerSummaryById } from "../../../../../../Redux Toolkit/features/customerSummary/customerSummaryThunks";
import { Separator } from "@/components/ui/separator";

const CustomerSummary = ({ customerId }) => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.customerSummary);

  useEffect(() => {
    if (customerId) dispatch(getCustomerSummaryById(customerId));
  }, [dispatch, customerId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!summary) return <p>No summary available</p>;

  const metrics = [
    { label: "Total Amount", value: summary.totalAmount },
    { label: "Total Cash", value: summary.totalCash },
    { label: "Total Credit", value: summary.totalCredit },
    { label: "Total Refund Cash", value: summary.totalRefundCash },
    { label: "Total Refund Credit", value: summary.totalRefundCredit },
    { label: "Total Refund Amount", value: summary.totalRefundAmount },
    { label: "Total Payment Amount", value: summary.totalPaymentAmount },
    { label: "Total Payment Cash", value: summary.totalPaymentCash },
    { label: "Total Payment Credit", value: summary.totalPaymentCredit },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Customer Summary</h2>
      
      <Separator />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerSummary;
