"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import ReusableTable from "@/pages/common/ReusableTable";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "./ConfirmDialog";
import { 
  useGetBranchPayrollsQuery, 
  useApprovePayrollMutation, 
  useMarkPayrollPaidMutation 
} from "@/Redux Toolkit/features/payroll/payrollApi";

export default function PayrollTable({ onSelectEmployee, onActionComplete }) {
  const { selectedBranchId } = useSelector((state) => state.user);
  
  // Unified Filter State
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentType: "",
    startDate: "",
    endDate: "",
    pageSize: 10,
    page: 0, 
  });

  // Fetching data - Note: Year/Month are hardcoded per your snippet
  const { data, isLoading } = useGetBranchPayrollsQuery({
    branchId: selectedBranchId,
    year: 2025,
    month: 11,
    // We pass page/size to API, but search/status will be handled locally by the table
    page: filters.page,
    size: filters.pageSize,
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
      if (dialogData.action === "approve") {
        await approvePayroll(dialogData.payrollId).unwrap();
      } else {
        await markPaid({ payrollId: dialogData.payrollId }).unwrap();
      }
      setDialogOpen(false);
      onActionComplete?.();
    } catch (err) { 
      console.error("Payroll Action Error:", err); 
    }
  };

  const columns = [
    {
      header: "Employee",
      accessor: "employeeName", 
      render: (value, row) => (
        <div onClick={() => onSelectEmployee?.(row.employeeId)} className="cursor-pointer group">
          <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{value}</p>
          <p className="text-[10px] text-gray-500 uppercase">{row.employeeEmail}</p>
        </div>
      ),
    },
    { 
      header: "Net Salary", 
      accessor: "netSalary", 
      render: (val) => `Rs. ${Number(val || 0).toLocaleString()}` 
    },
    { 
      header: "Status", 
      accessor: "status", 
      type: "status" 
    },
  ];

  const renderActions = (row) => (
    <div className="flex gap-2">
      {row.status === "DRAFT" && (
        <Button size="sm" variant="outline" onClick={() => handleActionClick("approve", row.id)}>
          Approve
        </Button>
      )}
      {row.status === "APPROVED" && (
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleActionClick("pay", row.id)}>
          Mark Paid
        </Button>
      )}
    </div>
  );

  if (!selectedBranchId) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-amber-600 font-medium">Please select a branch to view payroll records.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
      <ReusableTable
        // CRITICAL FIX: Set to false for client-side search/filter logic to run
        isServer={false} 
        isClient={true} 
        
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
          // Reset to page 0 when filters are applied
          setFilters({ ...updatedFilters, page: 0 }); 
        }}
      />

      <ConfirmDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={`Confirm ${dialogData.action === 'approve' ? 'Approval' : 'Payment'}`}
        description={`Are you sure you want to ${dialogData.action} this payroll record?`}
        onConfirm={handleConfirm}
      />
    </div>
  );
}