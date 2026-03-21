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

  // SERVER MODE
  isServer = false,
  page = 0,
  totalPages = 1,
  onPageChange = () => {},
  onFilter = () => {}, // This will be called when filter button clicked
  sort = null,
  onSortChange = () => {},
}) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
    status: "",
    paymentType: "",
    pageSize: 10,
  });

  /** SORT */
  const handleSort = (col) => {
    if (!col.sortable) return;
    let direction = "asc";
    if (sort?.field === col.accessor) direction = sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ field: col.accessor, direction });
  };

  /** CLIENT FILTER */
  const filteredData = useMemo(() => {
    if (isServer) return data;

    let temp = data;
    if (filters.search) {
      temp = temp.filter((row) =>
        columns.some((col) => String(row[col.accessor]).toLowerCase().includes(filters.search.toLowerCase()))
      );
    }
    if (filters.status) temp = temp.filter((row) => row.status === filters.status);
    if (filters.paymentType) temp = temp.filter((row) => row.paymentType === filters.paymentType);

    return temp;
  }, [data, filters, columns, isServer]);

  /** STATUS BADGES */
  const renderStatusBadge = (value) => {
    let base = "px-2 py-1 rounded-full text-sm font-semibold ";
    switch (value) {
      case "REFUNDED":
        base += "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
        break;
      case "PAID":
      case "COMPLETED":
        base += "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
        break;
      case "PENDING":
        base += "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
        break;
      default:
        base += "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
    return <span className={base}>{value}</span>;
  };

  /** ROW CLASS BY STATUS */
  const rowClassByStatus = (status) => {
    switch (status) {
      case "REFUNDED":
        return "bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800";
      case "PAID":
      case "COMPLETED":
        return "bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800";
      case "PENDING":
        return "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:hover:bg-yellow-800";
      default:
        return "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700";
    }
  };

  /** PAGINATION COMPONENT */
  const renderPagination = () => {
    const isSinglePage = totalPages <= 1;

    return (
      <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
        <Button size="sm" disabled={isSinglePage || page <= 0} onClick={() => onPageChange(0)}>
          {"<<"} First
        </Button>
        <Button size="sm" disabled={isSinglePage || page <= 0} onClick={() => onPageChange(page - 1)}>
          Prev
        </Button>
        <span className="px-2 text-sm font-medium">
          Page {Math.min(page + 1, totalPages || 1)} of {totalPages || 1}
        </span>
        <Button size="sm" disabled={isSinglePage || page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
        <Button size="sm" disabled={isSinglePage || page + 1 >= totalPages} onClick={() => onPageChange(totalPages - 1)}>
          Last {">>"}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="datetime-local"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="border p-1 m-1"
          placeholder="Start Date"
        />
        <input
          type="datetime-local"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="border p-1 m-1"
          placeholder="End Date"
        />
        <Input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-1 m-1"
        >
          <option value="">All Status</option>
          <option value="REFUNDED">Refunded</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={filters.paymentType}
          onChange={(e) => setFilters({ ...filters, paymentType: e.target.value })}
          className="border p-1 m-1"
        >
          <option value="">All Payment Types</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
        </select>
        <select
          value={filters.pageSize}
          onChange={(e) => setFilters({ ...filters, pageSize: Number(e.target.value) })}
          className="border p-1 m-1"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <Button size="sm" onClick={() => onFilter(filters)}>
          Filter
        </Button>
      </div>

      {/* Table */}
      <ShadTable className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-900">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessor}
                onClick={() => handleSort(col)}
                className={col.sortable ? "cursor-pointer select-none" : ""}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <>
                      <ChevronUp
                        className={`w-3 h-3 ${
                          sort?.field === col.accessor && sort?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-300"
                        }`}
                      />
                      <ChevronDown
                        className={`w-3 h-3 ${
                          sort?.field === col.accessor && sort?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-300"
                        }`}
                      />
                    </>
                  )}
                </div>
              </TableHead>
            ))}
            {actions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredData.length ? (
            filteredData.map((row, i) => (
              <TableRow key={i} className={`transition-all ${rowClassByStatus(row.status)}`}>
                {columns.map((col) => (
                  <TableCell key={col.accessor}>
                    {col.type === "status" ? renderStatusBadge(row[col.accessor]) : row[col.accessor]}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadTable>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ReusableTable;