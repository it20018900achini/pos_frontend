"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionsByStore } from "@/Redux Toolkit/features/transactions/transactionsSlice";
import { format } from "date-fns";
import { Download, FileText, LayoutGrid, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import ContentLayout from "../../Dashboard/ContentLayout";
import ReusableTable from "@//pages/common/ReusableTable"; // Ensure correct path

export default function StoreTransactionTablePagin() {
  const dispatch = useDispatch();
  
  // Data from Redux
  const { loading, content, page, totalPages, totalElements, allContent } = useSelector((s) => s.transactions);
  const { userProfile } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  // Local Filter State
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentType: "",
    startDate: "",
    endDate: "",
    pageSize: 20,
  });

  /** * COLUMNS DEFINITION
   * Premium renderers for a refined look
   */
  const columns = [
    { 
      header: "Type", 
      accessor: "type", 
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${val === "ORDER" ? "bg-indigo-500" : "bg-amber-500"}`} />
          <span className={`text-[10px] font-bold tracking-widest uppercase ${
            val === "ORDER" ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400"
          }`}>
            {val}
          </span>
        </div>
      )
    },
    { 
      header: "Reference", 
      accessor: "referenceId", 
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-neutral-500">#{val}</span>
    },
    { header: "Customer", accessor: "customer" },
    { header: "Cashier", accessor: "cashier" },
    { 
      header: "Amount", 
      accessor: "amount", 
      sortable: true,
      render: (val) => (
        <span className="font-bold text-neutral-900 dark:text-white">
          LKR {(val ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    { header: "Payment", accessor: "paymentMethod" },
    { 
      header: "Date", 
      accessor: "paidAt", 
      sortable: true,
      render: (val) => val ? format(new Date(val), "MMM dd, yyyy • HH:mm") : "—"
    },
  ];

  const handleFetch = useCallback((p = 0, s = filters.pageSize, currentFilters = filters) => {
    if (!storeId) return;

    const startIso = currentFilters.startDate ? `${currentFilters.startDate}T00:00:00` : null;
    const endIso = currentFilters.endDate ? `${currentFilters.endDate}T23:59:59` : null;

    dispatch(
      fetchTransactionsByStore({
        storeId,
        start: startIso,
        end: endIso,
        page: p,
        size: s,
      })
    );
  }, [storeId, dispatch, filters]);

  useEffect(() => {
    handleFetch(0, filters.pageSize);
  }, [storeId, handleFetch]);

  // CSV Export Logic
  const downloadCsv = (rows, filename) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.click();
  };

  return (
    <ContentLayout 
      title="Store Ledger" 
      subTitle="Real-time transaction monitoring and financial auditing"
    >
      <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* --- STATS OVERVIEW (Optional Premium Addition) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-900 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
            <div className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                <ReceiptText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Gross Volume</p>
                <h3 className="text-xl font-bold">LKR {totalElements > 0 ? "Calculated" : "0.00"}</h3>
              </div>
            </div>
          </div>
          {/* Add more stats cards here if needed */}
        </div>

        {/* --- ACTIONS BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-1">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-bold tracking-tight">Transactions Log</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-500">
              {totalElements} TOTAL
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg border-neutral-200 dark:border-neutral-800 shadow-sm h-9">
                <Download className="w-4 h-4 mr-2 opacity-60" /> Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2">
              <DropdownMenuItem onClick={() => downloadCsv(content, `store_page_${page}.csv`)} className="rounded-md cursor-pointer">
                <FileText className="w-4 h-4 mr-2 text-neutral-400" /> Export Current Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadCsv(allContent, `store_full_audit.csv`)} className="rounded-md cursor-pointer font-semibold text-indigo-600">
                <Download className="w-4 h-4 mr-2" /> Download Full Audit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* --- REUSABLE TABLE INTEGRATION --- */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 dark:shadow-none overflow-hidden p-2">
          <ReusableTable
            isServer={true}
            columns={columns}
            data={content || []}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => handleFetch(p, filters.pageSize)}
            filters={filters}
            setFilters={setFilters}
            onFilter={(updatedFilters) => handleFetch(0, updatedFilters.pageSize, updatedFilters)}
            enableSearch={true}
            enableDateRange={true}
            enableStatusFilter={true}
            enablePaymentFilter={true}
            enablePageSize={true}
          />
        </div>
      </div>
    </ContentLayout>
  );
}