import React, { useState } from "react";
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
import { useGetCustomerOrdersQuery } from "@/Redux Toolkit/features/customer/customerOrderApi";
import { Fragment } from "react";
import { Loader2 } from "lucide-react";

export default function CustomerOrderPage({ customerId }) {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading, isFetching } = useGetCustomerOrdersQuery({
    customerId,
    page,
    sortBy,
    sortDir,
    status,
    startDate,
    endDate,
  });

  const handleSort = (field) => {
    const newDir = sortDir === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortDir(newDir);
    setPage(0);
  };

  const clearFilters = () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  const content = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Customer Orders</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETE">Complete</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-1"
        />
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-1"
        />
        <Button onClick={clearFilters}>Clear</Button>
      </div>

      {/* Table */}
      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <p>Loading orders...</p>
        </div>
      ) : content.length === 0 ? (
        <p className="text-center my-3">No data found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("id")}>Order ID</TableHead>
              <TableHead onClick={() => handleSort("createdAt")}>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {content.map((order) => (
              <Fragment key={order.id}>
                <TableRow>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {order.customer?.fullName || "Walk-in Customer"}
                  </TableCell>
                  <TableCell>LKR {Number(order.totalAmount || 0).toFixed(2)}</TableCell>
                  <TableCell>{order.paymentType || "CASH"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "REFUNDED"
                          ? "bg-red-500 text-white"
                          : "bg-indigo-600 text-white"
                      }
                    >
                      {order.status || "COMPLETE"}
                    </Badge>
                  </TableCell>
                </TableRow>

                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((it) => (
                        <Badge key={it.id} className="text-sm px-3 py-1">
                          {it.product?.name} × {it.quantity}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Prev
        </Button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
