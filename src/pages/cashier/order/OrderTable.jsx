import React, { Fragment } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Status → Badge mapping
 */
const STATUS_CONFIG = {
  COMPLETED: {
    label: "COMPLETED",
    className: "bg-indigo-600 text-white",
  },
  PARTIALLY_REFUNDED: {
    label: "PARTIALLY REFUNDED",
    className: "bg-orange-500 text-white",
  },
  REFUNDED: {
    label: "REFUNDED",
    className: "bg-red-600 text-white",
  },
  PENDING: {
    label: "PENDING",
    className: "bg-gray-500 text-white",
  },
  CANCELLED: {
    label: "CANCELLED",
    className: "bg-slate-600 text-white",
  },
};

const OrderTable = ({ orders = [], handleViewOrder, handleRefundOrder }) => {
  if (!orders.length) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No orders found
      </div>
    );
  }

  return (
    <Table className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-md">
      <TableHeader>
        <TableRow className="bg-slate-100 dark:bg-slate-800">
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total (LKR)</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => {
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;

          return (
            <Fragment key={order.id}>
              <TableRow
                className={
                  order.status === "REFUNDED"
                    ? "bg-red-100 dark:bg-red-900/40"
                    : order.status === "PARTIALLY_REFUNDED"
                    ? "bg-orange-100 dark:bg-orange-900/40"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              >
                <TableCell className="font-medium">
                  {order.id}
                </TableCell>

                <TableCell>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
                </TableCell>

                <TableCell>
                  {order.customer?.fullName || "Walk-in Customer"}
                </TableCell>

                <TableCell>
                  {Number(order.totalAmount || 0).toFixed(2)}
                </TableCell>

                <TableCell>
                  {order.payments?.map((p) => p.paymentMethod).join(", ") ||
                    "CASH"}
                </TableCell>

                <TableCell>
                  <Badge className={status.className}>
                    {status.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="sm"
                    className="mr-2"
                    onClick={() => handleViewOrder(order)}
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleRefundOrder(order)}
                    disabled={
                      order.status !== "COMPLETED" &&
                      order.status !== "PARTIALLY_REFUNDED"
                    }
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
