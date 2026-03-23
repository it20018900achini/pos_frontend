"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import ReusableTable from "@/pages/common/ReusableTable"; // Changed to Default Import
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "./ConfirmDialog";
import { 
  useGetBranchPayrollsQuery, 
  useApprovePayrollMutation, 
  useMarkPayrollPaidMutation 
} from "@/Redux Toolkit/features/payroll/payrollApi";

export default function PayrollTable({ onSelectEmployee, onActionComplete }) {
  const { selectedBranchId } = useSelector((state) => state.user);
  
  // 1. Unified Filter State (matches your ReusableTable structure)
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentType: "",
    startDate: "",
    endDate: "",
    pageSize: 10,
    page: 0, // Track page inside filters or separately
  });

  const { data, isLoading } = useGetBranchPayrollsQuery({
    branchId: selectedBranchId,
    year: 2025,
    month: 11,
    page: filters.page,
    size: filters.pageSize,
    search: filters.search, // Passing search to server if isServer={true}
    status: filters.status
  }, { skip: !selectedBranchId });

  const [approvePayroll] = useApprovePayrollMutation();
  const [markPaid] = useMarkPayrollPaidMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ action: "", payrollId: null });

  const handleActionClick = (action, payrollId) => {
    setDialogData({ action, payrollId });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      if (dialogData.action === "approve") await approvePayroll(dialogData.payrollId).unwrap();
      else await markPaid({ payrollId: dialogData.payrollId }).unwrap();
      setDialogOpen(false);
      onActionComplete?.();
    } catch (err) { console.error(err); }
  };

  // 2. Column Definitions
  const columns = [
    {
      header: "Employee",
      accessor: "employeeName", // Matches DTO
      render: (value, row) => (
        <div onClick={() => onSelectEmployee?.(row.employeeId)} className="cursor-pointer">
          <p className="font-bold text-gray-900">{value}</p>
          <p className="text-[10px] text-gray-500 uppercase">{row.employeeEmail}</p>
        </div>
      ),
    },
    { 
      header: "Net Salary", 
      accessor: "netSalary", 
      render: (val) => `Rs. ${val?.toLocaleString()}` 
    },
    { 
      header: "Status", 
      accessor: "status", 
      type: "status" // This triggers your renderStatusBadge in ReusableTable
    },
  ];

  // 3. Row Actions
  const renderActions = (row) => (
    <div className="flex gap-2">
      {row.status === "DRAFT" && (
        <Button size="sm" variant="outline" onClick={() => handleActionClick("approve", row.id)}>
          Approve
        </Button>
      )}
      {row.status === "APPROVED" && (
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleActionClick("pay", row.id)}>
          Mark Paid
        </Button>
      )}
    </div>
  );

  if (!selectedBranchId) return <div className="p-8 text-center text-amber-600 font-medium">Please select a branch.</div>;

  return (
    <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
      <ReusableTable
        isServer={true} // Setting to true since we are using RTK Query pagination
        columns={columns}
        data={data?.content || []}
        loading={isLoading}
        actions={renderActions}
        
        // Pagination Props
        page={filters.page}
        totalPages={data?.totalPages || 0}
        onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
        
        // Filter Props
        filters={filters}
        setFilters={setFilters}
        enableSearch={true}
        enableStatusFilter={true}
        onFilter={(updatedFilters) => {
            // This triggers when "Apply Filters" is clicked
            setFilters({ ...updatedFilters, page: 0 }); 
        }}
      />

      <ConfirmDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="Confirm Payroll Action"
        onConfirm={handleConfirm}
      />
    </div>
  );
}