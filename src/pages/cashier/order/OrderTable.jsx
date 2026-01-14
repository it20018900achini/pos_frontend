import React, { Fragment } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Calculate total price including refunded items if any
 */
const getOrderTotals = (order) => {
  const totalPrice = order.items?.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );
  const refundedAmount = order.orderReturns?.reduce(
    (sum, r) => sum + Number(r.refundAmount || 0),
    0
  );
  return { totalPrice, refundedAmount };
};

const OrderTable = ({ orders, handleViewOrder, handleRefundOrder }) => {
  if (!orders.length) {
    return <div className="text-center text-muted-foreground py-6">No orders found</div>;
  }

  return (
    <Table className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-md">
      <TableHeader>
        <TableRow className="bg-slate-100 dark:bg-slate-800">
          <TableHead className="dark:text-slate-200">Order ID</TableHead>
          <TableHead className="dark:text-slate-200">Date</TableHead>
          <TableHead className="dark:text-slate-200">Customer</TableHead>
          <TableHead className="dark:text-slate-200">Total (LKR)</TableHead>
          <TableHead className="dark:text-slate-200">Payment</TableHead>
          <TableHead className="dark:text-slate-200">Status</TableHead>
          <TableHead className="text-right dark:text-slate-200">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => {
          const { totalPrice, refundedAmount } = getOrderTotals(order);
          const isFullyRefunded = refundedAmount >= totalPrice;

          const badgeClass = isFullyRefunded
            ? "bg-red-600 text-white"
            : order.hasReturnCount > 0
            ? "bg-orange-500 text-white"
            : "bg-indigo-600 text-white";

          const statusText = isFullyRefunded
            ? "ALL REFUNDED"
            : order.hasReturnCount > 0
            ? "PARTIALLY REFUNDED"
            : "COMPLETED";

          return (
            <Fragment key={order.id}>
              <TableRow
                className={
                  order.hasReturnCount > 0
                    ? "bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              >
                <TableCell className="font-medium dark:text-slate-200">{order.id}</TableCell>
                <TableCell className="dark:text-slate-300">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                </TableCell>
                <TableCell className="dark:text-slate-300">
                  {order.customer?.fullName || "Walk-in Customer"}
                </TableCell>
                <TableCell className="dark:text-slate-200">
                  {totalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="dark:text-slate-300">
                  {order.payments?.map(p => p.paymentMethod).join(", ") || "CASH"}
                </TableCell>
                <TableCell>
                  <Badge className={badgeClass}>{statusText}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => handleViewOrder(order)} className="mr-2">
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRefundOrder(order)}
                    disabled={isFullyRefunded}
                  >
                    Refund
                  </Button>
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
