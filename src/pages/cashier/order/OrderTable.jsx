import React, { Fragment } from "react";
import { formatDate, getPaymentModeLabel, getStatusBadgeVariant } from "./data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { EyeIcon } from "lucide-react";
import { PrinterIcon } from "lucide-react";
import { RotateCcwIcon } from "lucide-react";

const OrderTable = ({
  orders,
  handleViewOrder,
  handlePrintInvoice,
  handleInitiateReturn,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date/Time</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Mode</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <Fragment key={order.id}>
          <TableRow >
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{formatDate(order.createdAt)}</TableCell>
            <TableCell>
              {order.customer?.fullName || "Walk-in Customer"}
            </TableCell>
            <TableCell>LKR {order.totalAmount?.toFixed(2) || "0.00"}</TableCell>
            <TableCell>{(order.paymentType)}</TableCell>
            <TableCell>
              <Badge
                className={order.status=="REFUNDED"?"bg-red-500":""}
              >
                {order.status || "COMPLETE"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewOrder(order)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePrintInvoice(order)}
                >
                  <PrinterIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleInitiateReturn(order)}
                >
                  <RotateCcwIcon className="h-4 w-4" />
                </Button> */}
              </div>
            </TableCell>
          </TableRow>
           <TableRow className="borde-b border-neutral-400">
            <TableCell className="font-medium" colSpan={7}>
              {/* <pre>{JSON.stringify(order?.items,null,2)}</pre> */}
              {order?.items.map((it) => (
                <Fragment key={it.id}>
                  <Badge className={"mr-1"}>
                    {it?.product?.name} x {it?.quantity} <span className="text-red-500">{(it?.returned && it?.return_quantity>0) && " | R: "+it?.return_quantity}  </span>
                    {/* {JSON.stringify(it)} */}
                  </Badge>
                </Fragment>

              ))}
</TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
