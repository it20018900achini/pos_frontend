// src/components/CustomerRefundsPage.jsx
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
import { useGetCustomerRefundsQuery } from "@/Redux Toolkit/features/customer/customerRefundApi";
import { Loader2 } from "lucide-react";

export default function CustomerRefundsPage({ customerId }) {
  // ======== FILTER & PAGINATION STATE ========
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const size = 10;

  // ======== FETCH DATA ========
  const {
    data: refundsData,
    isLoading,
    isError,
  } = useGetCustomerRefundsQuery({
    customerId,
    page,
    size,
    sortBy,
    sortDir,
    status: filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const refunds = refundsData?.content || [];
  const totalPages = refundsData?.totalPages || 0;

  // ======== HANDLERS ========
  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPage(0); // Reset page when filter changes
  };

  const clearFilters = () => {
    setFilters({ status: "", startDate: "", endDate: "" });
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortDir(sortDir === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Customer Refunds</h2>

      {/* ========================= FILTERS ========================= */}
      <div className="flex gap-3 mb-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
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
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-1"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-1"
        />

        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {/* ========================= TABLE ========================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-4">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          Loading refunds...
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load refunds.</p>
      ) : refunds.length === 0 ? (
        <p className="text-center my-4">No refunds found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("id")}>Refund ID</TableHead>
              <TableHead onClick={() => handleSort("createdAt")}>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {refunds.map((refund) => (
              <React.Fragment key={refund.id}>
                <TableRow>
                  <TableCell>{refund.id}</TableCell>
                  <TableCell>
                    {refund.createdAt
                      ? new Date(refund.createdAt).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {refund.customer?.fullName || "Walk-in Customer"}
                  </TableCell>
                  <TableCell>
                    LKR {Number(refund.totalAmount || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>{refund.paymentType || "CASH"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        refund.status === "REFUNDED"
                          ? "bg-red-500 text-white"
                          : "bg-indigo-600 text-white"
                      }
                    >
                      {refund.status || "COMPLETE"}
                    </Badge>
                  </TableCell>
                </TableRow>

                {/* Item Row */}
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {refund.items?.map((it) => (
                        <Badge key={it.id} className="text-sm px-3 py-1">
                          {it.product?.name} × {it.quantity}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}

      {/* ========================= PAGINATION ========================= */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
