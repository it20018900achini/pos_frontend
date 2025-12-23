import { useState } from "react";
import { useGetPayrollStatsByBranchQuery } from "@/Redux Toolkit/features/payroll/payrollApi";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// LKR currency formatter
const formatLKR = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value || 0);

export default function PayrollStats({ branchId = 52 }) {
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data, isLoading } =
    useGetPayrollStatsByBranchQuery({ branchId, year, month });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        {/* Year */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Month */}
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {months.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading && <p>Loading payroll stats...</p>}

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          <div>Total Employees: <b>{data.totalEmployees}</b></div>
          <div>Paid: <b>{data.paidCount}</b></div>
          <div>Pending: <b>{data.pendingCount}</b></div>

          <div>Gross Salary: <b>{formatLKR(data.totalGrossSalary)}</b></div>
          <div>Deductions: <b>{formatLKR(data.totalDeductions)}</b></div>
          <div>Net Salary: <b>{formatLKR(data.totalNetSalary)}</b></div>
        </div>
      )}
    </div>
  );
}
