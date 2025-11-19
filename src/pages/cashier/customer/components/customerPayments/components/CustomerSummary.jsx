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
    { label: "Orders", value: summary.totalAmount,"sub":{
      cash:summary.totalCash,
      credit:summary.totalCredit
    } },
    { label: "Refunds", value: summary.totalRefundAmount,"sub":{
      cash:summary.totalRefundCash,
      credit:summary.totalRefundCredit
    } },
    { label: "Payments", value: summary.totalPaymentAmount,"sub":{
      cash:summary.totalPaymentCash,
      credit:summary.totalPaymentCredit
    } },
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
              <CardTitle className="flex justify-between overflow-auto">{metric.label}<span>LKR {metric.value}</span></CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between overflow-auto">
              <p className="text-sm font-semibold text-green-500">CASH {metric.sub?.cash}</p>
              <p className="text-sm font-semibold text-red-500">CREDIT {metric.sub?.credit}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerSummary;
