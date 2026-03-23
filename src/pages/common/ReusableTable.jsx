"use client";

import React, {  useMemo } from "react";
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
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
const FilterChip = ({ label, value, onClear }) => (
  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all animate-in fade-in zoom-in duration-200
    bg-white border-nebg-neutral-200 text-nebg-neutral-600 shadow-sm
    dark:bg-neutral-800 dark:border-nebg-neutral-700 dark:text-nebg-neutral-200">
    
    <span className="opacity-50 uppercase tracking-tighter text-[9px]">{label}:</span> 
    <span>{value}</span>
    {
      label!=="Size"&&<button
      onClick={onClear}
      className="ml-1 p-0.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-nebg-neutral-400 hover:text-rose-500 transition-colors"
    >
      <X className="h-3 w-3" />
    </button>
    }
    
  </div>
);
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
/** PREMIUM ROW STYLE (Light & Dark Mode) */
  const rowClassByStatus = (status) => {
    const base = "transition-colors duration-200 border-b border-nebg-neutral-100 dark:border-nebg-neutral-800/50";
    
    switch (status) {
      case "REFUNDED":
        return `${base} bg-rose-50/30 hover:bg-rose-50 dark:bg-rose-500/5 dark:hover:bg-rose-500/10`;
      
      case "PAID":
      case "COMPLETED":
        return `${base} bg-emerald-50/30 hover:bg-emerald-50 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10`;
      
      case "PENDING":
        return `${base} bg-amber-50/30 hover:bg-amber-50 dark:bg-amber-500/5 dark:hover:bg-amber-500/10`;
      
      default:
        return `${base} hover:bg-neutral-50 dark:hover:bg-neutral-800/50`;
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
     {/* --- APPLIED FILTERS (CHIPS) --- */}
<div className="flex flex-wrap gap-2 mb-4 items-center min-h-[32px]">
  {/* Filter Chips mapping - ensuring a cleaner, organized row */}
  {filters.search && <FilterChip label="Search" value={filters.search} onClear={() => setFilters({ ...filters, search: "" })} />}
  {filters.startDate && <FilterChip label="From" value={new Date(filters.startDate).toLocaleDateString()} onClear={() => setFilters({ ...filters, startDate: "" })} />}
  {filters.endDate && <FilterChip label="To" value={new Date(filters.endDate).toLocaleDateString()} onClear={() => setFilters({ ...filters, endDate: "" })} />}
  {filters.status && <FilterChip label="Status" value={filters.status} onClear={() => setFilters({ ...filters, status: "" })} />}
  {filters.paymentType && <FilterChip label="Payment" value={filters.paymentType} onClear={() => setFilters({ ...filters, paymentType: "" })} />}
  
  
  {filters.pageSize !== 10 && <FilterChip label="Size" value={filters.pageSize} onClear={() => setFilters({ ...filters, pageSize: 10 })} />}

  {/* Clear All - Premium Ghost Style */}
  {Object.values(filters).some((val) => val && val !== 10) && (
    <Button
      variant="ghost"
      size="sm"
      onClick={clearAllFilters}
      className="h-7 px-3 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all rounded-full"
    >
      Clear All
    </Button>
  )}
</div>

{/* --- MODERN TOOLBAR --- */}
{(enableSearch || enableDateRange || enableStatusFilter || enablePaymentFilter || enablePageSize) && (
  <div className="flex flex-wrap items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-900/50 border border-nebg-neutral-200 dark:border-nebg-neutral-800 rounded-xl mb-6 shadow-sm">
    
    {/* Date Range Inputs - Styled as a single group */}
    {enableDateRange && (
      <div className="flex items-center gap-1 bg-white dark:bg-neutral-950 border border-nebg-neutral-200 dark:border-nebg-neutral-800 rounded-lg px-2 h-10 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
        <input
          type="datetime-local"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="bg-transparent text-xs outline-none dark:text-nebg-neutral-200 dark:invert-[0.9] dark:hue-rotate-180"
        />
        <span className="text-nebg-neutral-300 dark:text-nebg-neutral-700">|</span>
        <input
          type="datetime-local"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="bg-transparent text-xs outline-none dark:text-nebg-neutral-200 dark:invert-[0.9] dark:hue-rotate-180"
        />
      </div>
    )}

    {/* Modern Search Input */}
    {enableSearch && (
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nebg-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder="Search records..."
          value={filters?.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 h-10 w-64 bg-white dark:bg-neutral-950 border-nebg-neutral-200 dark:border-nebg-neutral-800 rounded-lg shadow-sm focus:ring-emerald-500/20 transition-all"
        />
      </div>
    )}

    {/* Styled Selects */}
    <div className="flex items-center gap-2">
      {enableStatusFilter && (
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="h-10 px-3 text-xs bg-white dark:bg-neutral-950 border border-nebg-neutral-200 dark:border-nebg-neutral-800 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-nebg-neutral-600 dark:text-nebg-neutral-300 shadow-sm"
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
          onChange={(e) => setFilters({ ...filters, paymentType: e.target.value })}
          className="h-10 px-3 text-xs bg-white dark:bg-neutral-950 border border-nebg-neutral-200 dark:border-nebg-neutral-800 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-nebg-neutral-600 dark:text-nebg-neutral-300 shadow-sm"
        >
          <option value="">All Payment</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
        </select>
      )}
    </div>

    {/* Apply Filter Button - High Contrast */}
    <Button 
      size="sm" 
      onClick={() => onFilter(filters)}
      className="h-10 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md active:scale-95 transition-all ml-auto"
    >
      Apply Filters
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
                    <TableCell key={col.accessor} className="py-4 px-4 text-sm font-medium text-nebg-neutral-600">
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