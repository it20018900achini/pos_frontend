"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, fetchAllTransactions } from "@/Redux Toolkit/features/transactions/transactionsSlice";
import { format } from "date-fns";
import { Download, FileText, Database, ReceiptText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import ContentLayout from "../../Dashboard/ContentLayout";
import ReusableTable from "@/pages/common/ReusableTable";

/**
 * UTILITY: Safe CSV Export
 * Handles encoding, BOM for Excel, and DOM cleanup
 */
const exportToCsv = (rows, filename) => {
  if (!rows || rows.length === 0) {
    alert("No data available to export.");
    return;
  }

  try {
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const cell = r[h] === null || r[h] === undefined ? "" : String(r[h]);
            return `"${cell.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    // Add UTF-8 BOM for Excel compatibility
    const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.body.appendChild(document.createElement("a"));
    
    link.href = url;
    link.download = filename;
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
  }
};

export default function TransactionTablePagin() {
  const dispatch = useDispatch();
  
  // Redux State
  const { loading, content, page, totalPages, totalElements, allContent } = useSelector((s) => s.transactions);
  const { selectedBranchId } = useSelector((state) => state.user);

  // Filter State
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentType: "",
    startDate: "",
    endDate: "",
    pageSize: 20,
  });

  /**
   * TABLE COLUMNS
   * Premium renderers for financial data
   */
  const columns = [
    { 
      header: "Type", 
      accessor: "type", 
      sortable: true,
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${
          val === "ORDER" 
            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" 
            : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
        }`}>
          {val}
        </span>
      )
    },
    { 
      header: "Ref ID", 
      accessor: "referenceId", 
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-slate-500">#{val}</span>
    },
    { header: "Customer", accessor: "customer" },
    { header: "Cashier", accessor: "cashier" },
    { 
      header: "Amount", 
      accessor: "amount", 
      sortable: true,
      render: (val) => (
        <span className="font-bold text-slate-900 dark:text-white">
          LKR {(val ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    { header: "Payment", accessor: "paymentMethod" },
    { 
      header: "Date", 
      accessor: "paidAt", 
      sortable: true,
      render: (val) => val ? format(new Date(val), "MMM dd, hh:mm a") : "—"
    },
  ];

  /**
   * DATA FETCHING
   */
  const handleFetch = useCallback((p = 0, s = filters.pageSize, currentFilters = filters) => {
    if (!selectedBranchId) return;

    const startIso = currentFilters.startDate ? `${currentFilters.startDate}T00:00:00` : null;
    const endIso = currentFilters.endDate ? `${currentFilters.endDate}T23:59:59` : null;

    dispatch(
      fetchTransactions({
        branchId: selectedBranchId,
        start: startIso,
        end: endIso,
        page: p,
        size: s,
      })
    );
  }, [selectedBranchId, dispatch, filters]);

  useEffect(() => {
    handleFetch(0, filters.pageSize);
  }, [selectedBranchId, handleFetch]);

  return (
    <ContentLayout 
      title="Branch Transactions" 
      subTitle="Audit financial movements and sales history"
    >
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        
        {/* --- HEADER ACTIONS --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tight">Audit Overview</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {totalElements.toLocaleString()} <span className="text-sm font-medium text-slate-500">Records</span>
            </p>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 border-slate-200 dark:border-slate-800">
                  <Download className="w-4 h-4 mr-2 text-indigo-500" /> 
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer py-2"
                  onClick={() => exportToCsv(content, `transactions_page_${page + 1}.csv`)}
                >
                  <FileText className="w-4 h-4 mr-2 opacity-60" /> Export Current Page
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer py-2 text-indigo-600 font-semibold"
                  onClick={() => {
                    if (allContent?.length > 0) {
                      exportToCsv(allContent, `full_audit_log.csv`);
                    } else {
                      alert("Please fetch all records first or wait for the background sync.");
                    }
                  }}
                >
                  <Database className="w-4 h-4 mr-2" /> Full Audit Log (CSV)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* --- TABLE CONTAINER --- */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <ReusableTable
            isServer={true}
            columns={columns}
            data={content || []}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => handleFetch(p, filters.pageSize)}
            
            // Filter Props
            filters={filters}
            setFilters={setFilters}
            onFilter={(updated) => handleFetch(0, updated.pageSize, updated)}
            
            // Configurations
            enableDateRange={true}
            enableStatusFilter={true}
            enablePageSize={true}
            enableSearch={true}
          />
        </div>
      </div>
    </ContentLayout>
  );
}