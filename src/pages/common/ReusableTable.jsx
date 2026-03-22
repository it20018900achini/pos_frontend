"use client";

import React, { useMemo } from "react";
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
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search, 
  X, 
  Filter, 
  ArrowUpDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  filters = {},          
  setFilters = () => {}, 
  onFilter = () => {},
  enableSearch = false,
  enableDateRange = false,
  enableStatusFilter = false,
  enablePaymentFilter = false,
  enablePageSize = false,
}) => {

  /** SORT - Logic Unchanged */
  const handleSort = (col) => {
    if (!col.sortable) return;
    let direction = "asc";
    if (sort?.field === col.accessor) {
      direction = sort.direction === "asc" ? "desc" : "asc";
    }
    onSortChange({ field: col.accessor, direction });
  };

  /** CLIENT FILTER - Logic Unchanged */
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

  /** STATUS BADGE - Logic Unchanged (Styling Enhanced) */
  const renderStatusBadge = (value) => {
    let base = "px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-tight ";
    switch (value) {
      case "REFUNDED":
        base += "bg-red-50 text-red-700 border-red-100";
        break;
      case "PAID":
      case "COMPLETED":
        base += "bg-emerald-50 text-emerald-700 border-emerald-100";
        break;
      case "PENDING":
        base += "bg-amber-50 text-amber-700 border-amber-100";
        break;
      default:
        base += "bg-slate-50 text-slate-600 border-slate-100";
    }
    return <span className={base}>{value}</span>;
  };

  /** ROW STYLE - Logic Unchanged (Styling Enhanced) */
  const rowClassByStatus = (status) => {
    switch (status) {
      case "REFUNDED":
        return "bg-red-50/30 hover:bg-red-50/60";
      case "PAID":
      case "COMPLETED":
        return "bg-emerald-50/20 hover:bg-emerald-50/40";
      case "PENDING":
        return "bg-amber-50/20 hover:bg-amber-50/40";
      default:
        return "hover:bg-slate-50/80 transition-colors";
    }
  };

  /** CLEAR ALL FILTERS - Logic Unchanged */
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
      {/* 🏷️ ACTIVE FILTER PILLS */}
      <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
        {Object.entries(filters).map(([key, val]) => {
          if (!val || (key === 'pageSize' && val === 10)) return null;
          return (
            <div key={key} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 shadow-sm">
              <span className="capitalize text-slate-400">{key}:</span> {val}
              <button onClick={() => setFilters({ ...filters, [key]: "" })} className="hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
        {Object.values(filters).some((val) => val && val !== 10) && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-[11px] text-slate-500 hover:text-red-600">
            Clear All
          </Button>
        )}
      </div>

      {/* 🛠️ FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
        {enableDateRange && (
          <div className="flex items-center gap-1 bg-white border rounded-lg p-1 shadow-sm">
            <input type="datetime-local" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="text-xs p-1 outline-none" />
            <span className="text-slate-300">—</span>
            <input type="datetime-local" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="text-xs p-1 outline-none" />
          </div>
        )}

        {enableSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 h-10 w-64 bg-white border-slate-200 shadow-sm focus:ring-emerald-500"
            />
          </div>
        )}

        {enableStatusFilter && (
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white shadow-sm outline-none">
            <option value="">All Status</option>
            <option value="REFUNDED">Refunded</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        )}

        {enablePaymentFilter && (
          <select value={filters.paymentType} onChange={(e) => setFilters({ ...filters, paymentType: e.target.value })} className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white shadow-sm outline-none">
            <option value="">All Payment</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
          </select>
        )}

        {enablePageSize && (
          <select value={filters.pageSize} onChange={(e) => setFilters({ ...filters, pageSize: Number(e.target.value) })} className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white shadow-sm outline-none">
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        )}

        <Button size="sm" onClick={() => onFilter(filters)} className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-95">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>

      {/* 📊 TABLE AREA */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <ShadTable>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.accessor}
                  onClick={() => handleSort(col)}
                  className={cn(
                    "h-12 text-[11px] font-bold uppercase tracking-wider text-slate-500",
                    col.sortable && "cursor-pointer hover:text-slate-900 transition-colors"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <ArrowUpDown className="h-3 w-3 opacity-30" />}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="text-right pr-6">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-16 bg-slate-50/20" />
                </TableRow>
              ))
            ) : filteredData.length ? (
              filteredData.map((row, i) => (
                <TableRow key={i} className={cn("group border-slate-100", rowClassByStatus(row.status))}>
                  {columns.map((col) => (
                    <TableCell key={col.accessor} className="py-4 text-sm font-medium text-slate-600">
                      {col.type === "status"
                        ? renderStatusBadge(row[col.accessor])
                        : row[col.accessor]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right pr-6">
                      <div className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity">
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                     <div className="p-3 bg-slate-50 rounded-full mb-2"><Search className="h-6 w-6 text-slate-200" /></div>
                     <p className="text-sm font-semibold text-slate-900">No data found</p>
                     <p className="text-xs">Adjust your filters to see more results</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadTable>

        {/* 📑 PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Page <span className="text-slate-900">{page + 1}</span> of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <PaginationButton icon={<ChevronsLeft className="h-4 w-4"/>} onClick={() => onPageChange(0)} disabled={page <= 0} />
            <PaginationButton icon={<ChevronLeft className="h-4 w-4"/>} onClick={() => onPageChange(page - 1)} disabled={page <= 0} />
            <div className="w-[1px] h-4 bg-slate-200 mx-1" />
            <PaginationButton icon={<ChevronRight className="h-4 w-4"/>} onClick={() => onPageChange(page + 1)} disabled={page + 1 >= totalPages} />
            <PaginationButton icon={<ChevronsRight className="h-4 w-4"/>} onClick={() => onPageChange(totalPages - 1)} disabled={page + 1 >= totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaginationButton = ({ icon, onClick, disabled }) => (
  <Button
    variant="outline"
    size="icon"
    className="h-8 w-8 bg-white border-slate-200 text-slate-600 disabled:opacity-30 disabled:bg-slate-50 shadow-sm"
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
  </Button>
);

export default ReusableTable;