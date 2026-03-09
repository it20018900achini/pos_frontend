import React from "react";

// shadcn
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ShiftDetails = ({ shift }) => {
  if (!shift) {
    return (
      <div className="border flex items-center justify-center h-full text-muted-foreground">
        Select a shift to view details
      </div>
    );
  }

  const isOpen = shift.status === "OPEN";

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Shift #{shift.id}</CardTitle>

        <Badge variant={isOpen ? "default" : "secondary"}>
          {shift.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
          <Metric
            label="Start Time"
            value={new Date(shift.shiftStart).toLocaleString()}
          />

          <Metric
            label="End Time"
            value={
              shift.shiftEnd
                ? new Date(shift.shiftEnd).toLocaleString()
                : "-"
            }
          />

          <Metric label="Opening Cash" value={shift.openingCash} />

          <Metric label="Total Sales" value={shift.totalSales} />
        </div>

        <Separator />

        {/* SALES SUMMARY */}
        <div className="grid grid-cols-3 gap-4">
          <Metric label="Orders" value={shift.totalOrders} />

          <Metric label="Refunds" value={shift.totalRefunds} />

          <Metric label="Net Sales" value={shift.netSales} />
        </div>
      </CardContent>
    </Card>
  );
};

/* Metric component */

const Metric = ({ label, value }) => (
  <div className="border rounded-lg p-3 bg-muted/40">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold">{value ?? "-"}</p>
  </div>
);

export default ShiftDetails;