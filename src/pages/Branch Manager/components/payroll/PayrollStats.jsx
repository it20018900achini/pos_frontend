import { useState } from "react";
import { useGetPayrollStatsByBranchQuery } from "@/Redux Toolkit/features/payroll/payrollApi";

export default function PayrollStats({ branchId, renderChart }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data, isLoading } = useGetPayrollStatsByBranchQuery({
    branchId,
    year,
    month,
  });

  if (isLoading) return <p>Loading payroll stats...</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div >

<div className="md:flex w-full justify-between">
  <h2 className="text-xl font-semibold mb-2">Branch Payroll Stats</h2> <div className="flex gap-4 mb-4">
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

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ].map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
</div>
    <div className="space-y-4">
      {/* Filters */}
     

      {/* Stats Table */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>Total Employees: {data.totalEmployees}</div>
        <div>Paid: {data.paidCount}</div>
        <div>Pending: {data.pendingCount}</div>
        <div>Gross Salary: {data.totalGrossSalary}</div>
        <div>Deductions: {data.totalDeductions}</div>
        <div>Net Salary: {data.totalNetSalary}</div>
      </div>

      {/* Render chart if provided */}
      {renderChart && renderChart(data)}

      
    </div>
    </div>
  );
}
