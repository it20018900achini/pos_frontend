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

const OrderTable = ({
  orders = [],
  handleViewOrder,
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
    <Table>
      <TableHeader>
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
            
            {/* ✅ ORDER MAIN ROW */}
            <TableRow>
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
                  className={
                    order.hasReturnCount>0
                      ? "bg-red-500 text-white"
                      : "bg-green-600 text-white"
                  }
                >
                  {order.hasReturnCount>0? "REFUNDED": "COMPLETE"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewOrder(order)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>

            {/* ✅ ITEM ROW (Product List) */}
            <TableRow className="bg-muted/30">
              <TableCell colSpan={7} className="py-2">
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((it) => (
                    <Badge key={it.id} className="text-sm px-3 py-1">
                      {it.product?.name} × {it.quantity}
                      {it.returned && it.return_quantity > 0 ? (
                        <span className="ml-2 text-red-500 font-semibold">
                          | R: {it.return_quantity}
                        </span>
                      ) : null}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>

          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
