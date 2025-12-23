import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetBranchPayrollsQuery, useApprovePayrollMutation, useMarkPayrollPaidMutation } from "@/Redux Toolkit/features/payroll/payrollApi";
import PayrollStats from "./PayrollStats";
import PayrollTable from "./PayrollTable";
import SalaryForm from "./SalaryForm";

export default function PayrollAdmin() {
  const [branchId, setBranchId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data: payrolls, isLoading } = useGetBranchPayrollsQuery(
    branchId && year && month ? { branchId, year, month } : skipToken
  );

  const [approvePayroll] = useApprovePayrollMutation();
  const [markPayrollPaid] = useMarkPayrollPaidMutation();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Payroll Dashboard</h1>

      {/* Salary Form */}
      <SalaryForm employeeId={7}/>

      {/* Branch / Year / Month Inputs */}
      <div className="flex gap-4 items-center">
        <input
          type="number"
          placeholder="Branch ID"
          value={branchId}
          onChange={(e) => setBranchId(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2 rounded"
          min={1}
          max={12}
        />
      </div>

      {/* Payroll Stats */}
      <PayrollStats payrolls={payrolls} isLoading={isLoading} />

      {/* Payroll Table */}
      <PayrollTable
        payrolls={payrolls || []}
        onApprove={(id) => approvePayroll(id)}
        onPay={(id) => markPayrollPaid({ payrollId: id })}
      />
    </div>
  );
}
