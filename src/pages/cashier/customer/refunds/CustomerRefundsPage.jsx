// src/components/CustomerRefundsPage.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerRefunds,
  setPage,
  setSort,
  setFilters,
  resetFilters
} from "../../../../Redux Toolkit/features/customer/customerRefunds/customerRefundSlice";
import  { Fragment } from "react";
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
export default function CustomerRefundsPage({ customerId }) {
  const dispatch = useDispatch();

  const {
    content,
    number,
    totalPages,
    sortBy,
    sortDir,
    status,
    startDate,
    endDate,
    loading,
  } = useSelector((state) => state.customerRefund);

  // Load data
  useEffect(() => {
    dispatch(
      fetchCustomerRefunds({
        customerId,
        page: number,
        sortBy,
        sortDir,
        status,
        startDate,
        endDate,
      })
    );
  }, [customerId, number, sortBy, sortDir, status, startDate, endDate, dispatch]);

  // Sorting handler
  const handleSort = (field) => {
    const newDir = sortDir === "asc" ? "desc" : "asc";
    dispatch(setSort({ sortBy: field, sortDir: newDir }));
  };

  // Filter handler
  const handleFilterChange = (e) => {
    dispatch(
      setFilters({
        ...{
          status,
          startDate,
          endDate,
        },
        [e.target.name]: e.target.value,
      })
    );
  };

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Customer Refunds</h2>

      {/* ========================= FILTERS ========================= */}
      <div className="flex gap-3 mb-4">
        {/* Status Filter */}
        <select
          name="status"
          value={status}
          onChange={handleFilterChange}
          className="border p-1"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETE">Complete</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={handleFilterChange}
          className="border p-1"
        />

        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={handleFilterChange}
          className="border p-1"
        />

        <button onClick={clearFilters} className="border px-2">
          Clear
        </button>
      </div>

      {/* ========================= TABLE ========================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
          <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Refund ID</TableHead>
                   <TableHead>Date</TableHead>
                   <TableHead>Customer</TableHead>
                   <TableHead>Total</TableHead>
                   <TableHead>Payment Mode</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
         
               <TableBody>
                 {content.map((refund) => (
                   <Fragment key={refund.id}>
                     
                     {/* ✅ ORDER MAIN ROW */}
                     <TableRow>
                       <TableCell className="font-medium">{refund.id}</TableCell>
         
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
         
                       <TableCell className="text-right">
                         {/* <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => handleViewRefund(refund)}
                         >
                           <EyeIcon className="h-4 w-4" />
                         </Button> */}
                       </TableCell>
                     </TableRow>
         
                     {/* ✅ ITEM ROW (Product List) */}
                     <TableRow className="bg-muted/30">
                       <TableCell colSpan={7} className="py-2">
                         <div className="flex flex-wrap gap-2">
                           {refund.items?.map((it) => (
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
     
{/* <pre>{JSON.stringify(content,null,2)}</pre> */}
      {/* ========================= PAGINATION ========================= */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="border p-1 px-3"
          disabled={number === 0}
          onClick={() => dispatch(setPage(number - 1))}
        >
          Prev
        </button>

        <span>
          Page {number + 1} of {totalPages}
        </span>

        <button
          className="border p-1 px-3"
          disabled={number + 1 >= totalPages}
          onClick={() => dispatch(setPage(number + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
