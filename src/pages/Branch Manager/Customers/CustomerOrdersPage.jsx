// src/components/CustomerOrderPage.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerOrders,
  setPage,
  setSort,
  setFilters,
  resetFilters
} from "@/Redux Toolkit/features/customer/customerOrders/customerOrderSlice";
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
import { Loader2 } from "lucide-react";
export default function CustomerOrderPage({ customerId }) {
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
  } = useSelector((state) => state.customerOrder);

  // Load data
  useEffect(() => {
    dispatch(
      fetchCustomerOrders({
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
      <h2 className="text-lg font-bold mb-2">Customer Orders</h2>

      {/* ========================= FILTERS ========================= */}
      <div className="mb-4">
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
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Loading customer orders...</p>
      </div>
      ) : (
          <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Order ID</TableHead>
                   <TableHead>Date</TableHead>
                   <TableHead>CashierId</TableHead>
                   <TableHead>Total</TableHead>
                   <TableHead>Payment Mode</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
         
               <TableBody>
                 {content.map((order) => (
                   <Fragment key={order?.id}>
                     
                     {/* ✅ ORDER MAIN ROW */}
                     <TableRow>
                       <TableCell className="font-medium">{order?.id}</TableCell>
         
                       <TableCell>
                         {order?.createdAt
                           ? new Date(order.createdAt).toLocaleString()
                           : "-"}
                       </TableCell>
         
                       <TableCell className="text-center">
                         {order?.cashierId}
                       </TableCell>
         
                       <TableCell>
                         LKR {Number(order?.totalAmount || 0).toFixed(2)}
                       </TableCell>
         
                       <TableCell>{order?.paymentType || "CASH"}</TableCell>
         
                       <TableCell>
                         <Badge
                           className={
                             order.status === "REFUNDED"
                               ? "bg-red-500 text-white"
                               : "bg-green-600 text-white"
                           }
                         >
                           {order.status || "COMPLETE"}
                         </Badge>
                       </TableCell>
         
                       <TableCell className="text-right">
                         {/* <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => handleViewOrder(order)}
                         >
                           <EyeIcon className="h-4 w-4" />
                         </Button> */}
                       </TableCell>
                     </TableRow>
         
                     {/* ✅ ITEM ROW (Product List) */}
                     {/* <TableRow className="bg-muted/30">
                       <TableCell colSpan={7} className="py-2">
                         <div className="flex flex-wrap gap-2">
                           {order.items?.map((it) => (
                             <Badge key={it.id} className="text-sm px-3 py-1">
                               {it.product?.name} × {it.quantity}
                               
                             </Badge>
                           ))}
                         </div>
                       </TableCell>
                     </TableRow> */}
         
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
