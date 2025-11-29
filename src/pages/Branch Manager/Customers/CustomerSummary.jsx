import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getCustomerSummaryById } from "@/Redux Toolkit/features/customerSummary/customerSummaryThunks";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const CustomerSummary = ({ customerId }) => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.customerSummary);

  useEffect(() => {
    if (customerId) dispatch(getCustomerSummaryById(customerId));
  }, [dispatch, customerId]);

  if (loading) return <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Loading customer summary...</p>
      </div>;
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
      
      <Separator />

      {/* Metrics Grid */}
      <div className="">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-white shadow-md mb-2">
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
