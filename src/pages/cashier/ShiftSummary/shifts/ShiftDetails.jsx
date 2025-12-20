import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShiftById,
  clearSelectedShift,
} from "../../../../Redux Toolkit/features/shift/shiftSlice";

// shadcn
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShiftDetails = ({ shiftId }) => {
  const dispatch = useDispatch();
  const { selectedShift, loading, error } = useSelector(
    (state) => state.shift
  );

  useEffect(() => {
    if (shiftId) dispatch(fetchShiftById(shiftId));
    return () => dispatch(clearSelectedShift());
  }, [dispatch, shiftId]);

  if (!shiftId)
    return <p className="text-muted-foreground">Select a shift</p>;

  if (loading) return <p>Loading shift details...</p>;
  if (error) return <p className="text-destructive">{error}</p>;
  if (!selectedShift) return null;

  const isOpen = selectedShift.status === "OPEN";

  return (
    <Card className="w-full shadow-lg border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          Shift #{selectedShift.id}
        </CardTitle>

        <Badge variant={isOpen ? "success" : "secondary"}>
          {selectedShift.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="Opening Cash" value={selectedShift.openingCash} />
          <Metric label="Expected Cash" value={selectedShift.expectedCash} />
          <Metric
            label="Actual Cash"
            value={selectedShift.actualCash ?? "-"}
          />
          <Metric
            label="Cash Difference"
            value={selectedShift.cashDifference ?? "-"}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="Total Sales" value={selectedShift.totalSales} />
          <Metric label="Total Refunds" value={selectedShift.totalRefunds} />
          <Metric label="Net Sales" value={selectedShift.netSales} />
          <Metric label="Orders" value={selectedShift.totalOrders} />
        </div>

        {/* TOP PRODUCTS */}
        <div>
          <h3 className="font-semibold mb-2">Top Products</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedShift.topProducts?.map((p) => (
                <TableRow key={p.productId}>
                  <TableCell>{p.productName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {p.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* PAYMENT SUMMARY */}
        <div>
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedShift.paymentSummaries?.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell>{p.type}</TableCell>
                  <TableCell className="text-right">
                    {p.totalAmount}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.transactionCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

/* ------------------ Small Metric Component ------------------ */
const Metric = ({ label, value }) => (
  <div className="rounded-lg border p-3 bg-muted/40">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default ShiftDetails;
