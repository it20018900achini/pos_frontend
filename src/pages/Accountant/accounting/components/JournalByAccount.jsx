"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetJournalsQuery,
  useDeleteJournalMutation,
  useUpdateJournalEntryMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { Button } from "@/components/ui/button";
import { formatDate, formatDistanceToNow } from "date-fns";
import { Trash2, Edit } from "lucide-react";
import ReusableTable from "@/pages/common/ReusableTable"; // Adjust path as needed

export default function JournalByAccount() {
  const { selectedBranchId } = useSelector((state) => state.user);
  
  const [filters, setFilters] = useState({ 
    search: "", 
    status: "", 
    startDate: "", 
    endDate: "", 
    pageSize: 5 
  });
  const [page, setPage] = useState(0);

  // Server-side fetch
  const { data: journalsPage, isLoading, refetch } = useGetJournalsQuery({
    branchId: selectedBranchId,
    entryId: filters.search ? Number(filters.search) : null,
    page: page,
    size: filters.pageSize,
  });

  const [deleteJournal] = useDeleteJournalMutation();

  // Define Columns for the ReusableTable
  const columns = [
    {
      header: "Journal Details",
      accessor: "description",
      render: (val, row) => (
        <div className="space-y-1 min-w-[200px]">
          <div className="font-bold text-slate-900">{val}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-tight">
            ID: #{row.id} • {formatDate(new Date(row.entryDate), "yyyy-MM-dd")}
          </div>
          <div className="text-[10px] italic text-slate-400">
            {formatDistanceToNow(new Date(row.entryDate), { addSuffix: true })}
          </div>
        </div>
      ),
    },
    {
      header: "Account Entries (Lines)",
      accessor: "lines",
      render: (lines) => (
        <div className="w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 py-1 border-b border-slate-50 last:border-0">
              <span className="text-xs font-medium text-slate-600">#{line.account?.name || "N/A"}</span>
              <span className="text-right text-xs text-emerald-600 font-semibold">
                {line.debit > 0 ? line.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
              </span>
              <span className="text-right text-xs text-red-500 font-semibold">
                {line.credit > 0 ? line.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page on filter
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Journal Entries</h2>
      </div>

      <ReusableTable
        columns={columns}
        data={journalsPage?.content || []}
        loading={isLoading}
        isServer={true} // Since you are using RTK Query pagination
        page={page}
        totalPages={journalsPage?.totalPages || 1}
        onPageChange={handlePageChange}
        filters={filters}
        setFilters={setFilters}
        onFilter={handleFilterApply}
        enableSearch={true}
        enablePageSize={true}
        actions={(row) => (
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500">
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-red-500"
              onClick={async () => {
                if(confirm("Delete this journal?")) {
                  await deleteJournal(row.id);
                  refetch();
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}