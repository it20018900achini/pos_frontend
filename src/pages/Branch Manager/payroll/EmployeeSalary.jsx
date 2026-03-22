"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetSalariesByBranchQuery } from "@/Redux Toolkit/features/salary/salaryApi";
import { Settings2, UserCircle2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import SalaryPayrollDialog from "../components/payroll/SalaryPayrollDialog";
import AddSalaryPayrollDialog from "../components/payroll/AddSalaryPayrollDialog";
import ContentLayout from "../../Dashboard/ContentLayout";
import ReusableTable from "@/pages/common/ReusableTable"; 

export default function SalaryTable() {
  const { selectedBranchId } = useSelector((state) => state.user);
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenAdd, setDialogOpenAdd] = useState(false);

  // ReusableTable Filter State
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentType: "",
    startDate: "",
    endDate: "",
    pageSize: 10,
  });

  const { data, isLoading } = useGetSalariesByBranchQuery(selectedBranchId, {
    skip: !selectedBranchId,
  });

  const handleEditClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setDialogOpen(true);
  };

  /** * COLUMNS ALIGNED TO YOUR REUSABLE COMPONENT 
   * Uses 'accessor' and 'render' as per your code
   */
  const columns = useMemo(() => [
    {
      header: "Employee",
      accessor: "employeeName",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <UserCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {value}
          </span>
        </div>
      ),
    },
    {
      header: "Basic Salary",
      accessor: "basicSalary",
      sortable: true,
      render: (value) => (
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
          Rs. {(value ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Allowances",
      accessor: "hra", // Primary accessor for sorting/filtering
      render: (_, row) => (
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            HRA: Rs. {row.hra ?? 0}
          </span>
          <span className="text-slate-400">
            Med: {row.medical ?? 0} | Tra: {row.transport ?? 0}
          </span>
        </div>
      ),
    },
    {
      header: "OT Rate",
      accessor: "overtimeRate",
      render: (value) => (
        <span className="text-emerald-600 font-medium">
          {value ? `Rs. ${value}/hr` : "—"}
        </span>
      ),
    },
    {
      header: "Statutory",
      accessor: "epfPercentage",
      render: (_, row) => (
        <div className="flex gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
            EPF {row.epfPercentage}%
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
            ETF {row.etfPercentage}%
          </span>
        </div>
      ),
    },
  ], []);

  // Action column passed separately to ReusableTable
  const renderActions = (row) => (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 transition-all"
      onClick={() => handleEditClick(row.employeeId)}
    >
      <Settings2 className="w-4 h-4 mr-2" />
      Manage
    </Button>
  );

  return (
    <ContentLayout
      loadingSpinner={isLoading}
      title="Employee Payroll"
      subTitle="Configure and audit employee salary structures"
      right={
        <Button
          onClick={() => setDialogOpenAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 px-6 transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Configure Salary
        </Button>
      }
    >
      <div className="space-y-6">
        <AddSalaryPayrollDialog
          open={dialogOpenAdd}
          setOpen={setDialogOpenAdd}
          employeeId={null}
        />

        {selectedEmployeeId && (
          <SalaryPayrollDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            employeeId={selectedEmployeeId}
          />
        )}

        {/* --- INTEGRATED REUSABLE TABLE --- */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ReusableTable
            columns={columns}
            data={data || []}
            loading={isLoading}
            actions={renderActions}
            enableSearch={true}
            filters={filters}
            setFilters={setFilters}
            // Passing empty handler if not using server-side logic yet
            onFilter={(f) => console.log("Applying filters:", f)}
          />
        </div>
      </div>
    </ContentLayout>
  );
}