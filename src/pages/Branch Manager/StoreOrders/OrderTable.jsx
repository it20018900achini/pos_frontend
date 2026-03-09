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
import { EyeIcon } from "lucide-react";
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
      <div className="text-center py-6 text-gray-700 dark:text-gray-300">
        No orders found
      </div>
    );
  }

  return (
    <Table className="bg-white dark:bg-[#111827] rounded-lg shadow-md overflow-hidden">
      <TableHeader className="bg-gray-100 dark:bg-[#1F2937]">
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Payment Mode</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <Fragment key={order.id}>
            {/* ORDER MAIN ROW */}
            <TableRow
              className={`transition-colors duration-200 ${
                order.hasReturnCount > 0
                  ? "bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                  : "hover:bg-gray-50 dark:hover:bg-[#1E293B]"
              }`}
            >
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                {order.customer?.fullName || "Walk-in Customer"}
              </TableCell>
              <TableCell>
                LKR {Number(order.totalAmount || 0).toFixed(2)}
              </TableCell>
              <TableCell>{order.paymentType || "CASH"}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    order.hasReturnCount > 0
                      ? "bg-red-500 text-white dark:bg-red-600"
                      : "bg-indigo-600 text-white dark:bg-indigo-500"
                  }`}
                >
                  {getFlattenedRefundSummaryWithTotals(order)?.totals?.totalPrice ===
                  order.totalAmount
                    ? "All REFUNDED"
                    : order.hasReturnCount > 0
                    ? "REFUNDED"
                    : "COMPLETE"}
                </Badge>
              </TableCell>
              <TableCell className="text-right flex gap-1 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewOrder(order)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
                {order.hasReturnCount > 0 ? (
                  <Button size="sm" onClick={() => handleReturnOrder(order)}>
                    Refunds
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled>
                    Refunds
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
