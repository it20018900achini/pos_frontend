"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ReusableTable from "@/pages/common/ReusableTable";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "./ConfirmDialog";
import { 
  useGetBranchPayrollsQuery, 
  useApprovePayrollMutation, 
  useMarkPayrollPaidMutation 
} from "@/Redux Toolkit/features/payroll/payrollApi";

// Constants for the selectors
const MONTHS = [
  { val: 1, label: "January" }, { val: 2, label: "February" }, { val: 3, label: "March" },
  { val: 4, label: "April" }, { val: 5, label: "May" }, { val: 6, label: "June" },
  { val: 7, label: "July" }, { val: 8, label: "August" }, { val: 9, label: "September" },
  { val: 10, label: "October" }, { val: 11, label: "November" }, { val: 12, label: "December" }
];

export default function PayrollTable({ onSelectEmployee, onActionComplete }) {
  const { selectedBranchId } = useSelector((state) => state.user);
  
  // 1. Get current date for initial state
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 2. Unified Filter State (Including Year/Month)
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentType: "",
    startDate: "",
    endDate: "",
    year: currentYear,
    month: currentMonth,
    pageSize: 10,
    page: 0, 
  });

  // 3. Generate dynamic year list (Last 5 years)
  const yearOptions = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, [currentYear]);

  // 4. Fetching data - Year and Month are now dynamic from state
  const { data, isLoading } = useGetBranchPayrollsQuery({
    branchId: selectedBranchId,
    year: filters.year,
    month: filters.month,
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
          <p className="font-bold text-gray-900 dark:text-neutral-100 group-hover:text-emerald-600 transition-colors">{value}</p>
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
      <div className="p-12 text-center border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-xl">
        <p className="text-amber-600 font-medium">Please select a branch to view payroll records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* PERIOD SELECTOR PANEL */}
      <div className="flex flex-wrap items-end gap-4 p-5 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Payroll Year</label>
          <select 
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: Number(e.target.value), page: 0 }))}
            className="h-10 min-w-[120px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Payroll Month</label>
          <select 
            value={filters.month}
            onChange={(e) => setFilters(prev => ({ ...prev, month: Number(e.target.value), page: 0 }))}
            className="h-10 min-w-[150px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          >
            {MONTHS.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
          </select>
        </div>

        <div className="ml-auto text-right pb-1">
          <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">Active Period</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
            {MONTHS.find(m => m.val === filters.month)?.label} {filters.year}
          </p>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <ReusableTable
          isServer={false} 
          isClient={true} 
          columns={columns}
          data={data?.content || []}
          loading={isLoading}
          actions={renderActions}
          
          page={filters.page}
          totalPages={data?.totalPages || 0}
          onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
          
          filters={filters}
          setFilters={setFilters}
          enableSearch={true}
          enableStatusFilter={true}
          
          onFilter={(updatedFilters) => {
            setFilters({ ...updatedFilters, page: 0 }); 
          }}
        />
      </div>

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