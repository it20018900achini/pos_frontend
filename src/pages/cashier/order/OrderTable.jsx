import React, { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFlattenedRefundSummaryWithTotals } from "./getFlattenedRefundSummaryWithTotals";

const OrderTable = ({
  orders = [],
  handleViewOrder,
  handleReturnOrder,
  handlePrintInvoice,
  handleInitiateReturn,
}) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No orders found
      </div>
    );
  }

  return (
    <Table
      className="
        bg-white 
        dark:bg-slate-900 
        rounded-lg 
        shadow-sm 
        dark:shadow-md
      "
    >
      <TableHeader>
        <TableRow className="bg-slate-100 dark:bg-slate-800">
          <TableHead className="dark:text-slate-200">Order ID</TableHead>
          <TableHead className="dark:text-slate-200">Date</TableHead>
          <TableHead className="dark:text-slate-200">Customer</TableHead>
          <TableHead className="dark:text-slate-200">Total</TableHead>
          <TableHead className="dark:text-slate-200">Payment Mode</TableHead>
          <TableHead className="dark:text-slate-200">Status</TableHead>
          <TableHead className="text-right dark:text-slate-200">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => {
          const totals = getFlattenedRefundSummaryWithTotals(order)?.totals;
          const isFullyRefunded =
            totals?.totalPrice === Number(order.totalAmount);

          return (
            <Fragment key={order.id}>
              {/* ORDER MAIN ROW */}
              <TableRow
                className={
                  order.hasReturnCount > 0
                    ? "bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              >
                <TableCell className="font-medium dark:text-slate-200">
                  {order.id}
                </TableCell>

                <TableCell className="dark:text-slate-300">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
                </TableCell>

                <TableCell className="dark:text-slate-300">
                  {order.customer?.fullName || "Walk-in Customer"}
                </TableCell>

                <TableCell className="dark:text-slate-200">
                  LKR {Number(order.totalAmount || 0).toFixed(2)}
                </TableCell>

                <TableCell className="dark:text-slate-300">
                  {order.paymentType || "CASH"}
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      isFullyRefunded
                        ? "bg-red-600 text-white"
                        : order.hasReturnCount > 0
                        ? "bg-orange-500 text-white"
                        : "bg-indigo-600 text-white"
                    }
                  >
                    {isFullyRefunded
                      ? "All REFUNDED"
                      : order.hasReturnCount > 0
                      ? "REFUNDED"
                      : "COMPLETE"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                    className="mr-1"
                  >
                    Order
                  </Button>

                  {order.hasReturnCount > 0 ? (
                    <Button size="sm" onClick={() => handleReturnOrder(order)}>
                      Refunds
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      Refunds
                    </Button>
                  )}
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
