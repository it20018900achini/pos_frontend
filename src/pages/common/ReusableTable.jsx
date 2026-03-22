"use client";

import React, { useState, useMemo } from "react";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const ReusableTable = ({
  columns = [],
  data = [],
  loading = false,
  actions = null,
  isServer = false,
  page = 0,
  totalPages = 1,
  onPageChange = () => {},
  sort = null,
  onSortChange = () => {},
  filters = { search: "", status: "", paymentType: "", startDate: "", endDate: "", pageSize: 10 },
  setFilters = () => {}, // ✅ FIX HERE

  onFilter = () => {},
  enableSearch = false,
  enableDateRange = false,
  enableStatusFilter = false,
  enablePaymentFilter = false,
  enablePageSize = false,
}) => {
  

  /** SORT */
  const handleSort = (col) => {
    if (!col.sortable) return;

    let direction = "asc";
    if (sort?.field === col.accessor) {
      direction = sort.direction === "asc" ? "desc" : "asc";
    }

    onSortChange({ field: col.accessor, direction });
  };

  /** CLIENT FILTER */
  const filteredData = useMemo(() => {
    if (isServer) return data;

    let temp = data;

    if (enableSearch && filters.search) {
      temp = temp.filter((row) =>
        columns.some((col) =>
          String(row[col.accessor])
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        )
      );
    }

    if (enableStatusFilter && filters.status) {
      temp = temp.filter((row) => row.status === filters.status);
    }

    if (enablePaymentFilter && filters.paymentType) {
      temp = temp.filter((row) => row.paymentType === filters.paymentType);
    }

    return temp;
  }, [data, filters, columns, isServer]);

  /** STATUS BADGE */
  const renderStatusBadge = (value) => {
    let base = "px-2 py-1 rounded-full text-sm font-semibold ";

    switch (value) {
      case "REFUNDED":
        base += "bg-red-100 text-red-800";
        break;
      case "PAID":
      case "COMPLETED":
        base += "bg-green-100 text-green-800";
        break;
      case "PENDING":
        base += "bg-yellow-100 text-yellow-800";
        break;
      default:
        base += "bg-gray-100 text-gray-800";
    }

    return <span className={base}>{value}</span>;
  };

  /** ROW STYLE */
  const rowClassByStatus = (status) => {
    switch (status) {
      case "REFUNDED":
        return "bg-red-50 hover:bg-red-100";
      case "PAID":
      case "COMPLETED":
        return "bg-green-50 hover:bg-green-100";
      case "PENDING":
        return "bg-yellow-50 hover:bg-yellow-100";
      default:
        return "hover:bg-gray-50";
    }
  };

  /** ✅ FIXED PAGINATION */
  const renderPagination = () => {
    const safePage = page ?? 0;
    const safeTotal = totalPages ?? 1;
    const isSinglePage = safeTotal <= 1;

    return (
      <div className="flex items-center justify-end gap-2 mt-3">
        <Button
          size="sm"
          disabled={isSinglePage || safePage <= 0}
          onClick={() => onPageChange(0)}
        >
          {"<<"}
        </Button>

        <Button
          size="sm"
          disabled={isSinglePage || safePage <= 0}
          onClick={() => onPageChange(safePage - 1)}
        >
          Prev
        </Button>

        <span className="px-2 text-sm font-medium">
          Page {safePage + 1} of {safeTotal}
        </span>

        <Button
          size="sm"
          disabled={isSinglePage || safePage + 1 >= safeTotal}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
        </Button>

        <Button
          size="sm"
          disabled={isSinglePage || safePage + 1 >= safeTotal}
          onClick={() => onPageChange(safeTotal - 1)}
        >
          {">>"}
        </Button>
      </div>
    );
  };

  /** CLEAR ALL FILTERS */
  const clearAllFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      search: "",
      status: "",
      paymentType: "",
      pageSize: 10,
    });
    onFilter({
      startDate: "",
      endDate: "",
      search: "",
      status: "",
      paymentType: "",
      pageSize: 10,
    });
  };

  return (
    <div className="space-y-4">
      {/* DISPLAY APPLIED FILTERS WITH CLEAR BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-2 text-sm items-center">
        {filters.search && (
          <span className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            Search: {filters.search}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({ ...filters, search: "" })}
            >
              ×
            </button>
          </span>
        )}
        {filters.startDate && (
          <span className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            From: {new Date(filters.startDate).toLocaleString()}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({ ...filters, startDate: "" })}
            >
              ×
            </button>
          </span>
        )}
        {filters.endDate && (
          <span className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            To: {new Date(filters.endDate).toLocaleString()}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({ ...filters, endDate: "" })}
            >
              ×
            </button>
          </span>
        )}
        {filters.status && (
          <span className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            Status: {filters.status}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({ ...filters, status: "" })}
            >
              ×
            </button>
          </span>
        )}
        {filters.paymentType && (
          <span className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            Payment: {filters.paymentType}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({ ...filters, paymentType: "" })}
            >
              ×
            </button>
          </span>
        )}
        {filters.pageSize && (
          <span className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            Page Size: {filters.pageSize}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({ ...filters, pageSize: 10 })}
            >
              ×
            </button>
          </span>
        )}
        {/* CLEAR ALL BUTTON */}
        {Object.values(filters).some((val) => val) && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
            className="ml-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* FILTERS */}
      {(enableSearch ||
        enableDateRange ||
        enableStatusFilter ||
        enablePaymentFilter ||
        enablePageSize) && (
        <div className="flex flex-wrap gap-2 items-center">
          {enableDateRange && (
            <>
              <input
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="border p-1"
              />
              <input
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="border p-1"
              />
            </>
          )}

          {enableSearch && (
           <Input
              placeholder="Search..."
              // ✅ FIX 2: Ensure value is never undefined to prevent read-only error
              value={filters?.search || ""} 
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 h-10 w-64 bg-white border-slate-200 shadow-sm focus:ring-emerald-500"
            />
          )}

          {enableStatusFilter && (
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border p-1"
            >
              <option value="">All Status</option>
              <option value="REFUNDED">Refunded</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          )}

          {enablePaymentFilter && (
            <select
              value={filters.paymentType}
              onChange={(e) =>
                setFilters({ ...filters, paymentType: e.target.value })
              }
              className="border p-1"
            >
              <option value="">All Payment</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
            </select>
          )}

          {enablePageSize && (
            <select
              value={filters.pageSize}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  pageSize: Number(e.target.value),
                })
              }
              className="border p-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          )}

          <Button size="sm" onClick={() => onFilter(filters)}>
            Filter
          </Button>
        </div>
      )}

      {/* TABLE */}
      <ShadTable>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessor}
                onClick={() => handleSort(col)}
                className={col.sortable ? "cursor-pointer" : ""}
              >
                {col.header}
              </TableHead>
            ))}
            {actions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredData.length ? (
            filteredData.map((row, i) => (
              <TableRow key={i} className={rowClassByStatus(row.status)}>
                {columns.map((col) => (
                    <TableCell key={col.accessor} className="py-4 px-4 text-sm font-medium text-slate-600">
                      {/* ✅ FIX 3: Prioritize custom render function for objects/arrays */}
                      {col.render 
                        ? col.render(row[col.accessor], row) 
                        : col.type === "status" 
                        ? renderStatusBadge(row[col.accessor]) 
                        : row[col.accessor]}
                    </TableCell>
                  ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadTable>

      {renderPagination()}
    </div>
  );
};

export default ReusableTable;