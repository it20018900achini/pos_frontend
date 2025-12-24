"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import SalaryForm from "../components/payroll/SalaryForm";
import PayrollForm from "../components/payroll/PayrollForm";
import PayrollStats from "../components/payroll/PayrollStats";
import PayrollTable from "../components/payroll/PayrollTable";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import SalaryPayrollModal from "../components/payroll/SalaryPayrollModal";
import SalaryPayrollDialog from "../components/payroll/SalaryPayrollDialog";
import SalaryTable from "../components/payroll/SalaryTable";

export default function BranchPayrollDashboard() {
  const { branch } = useSelector((state) => state.branch);
  const branchId = branch?.id;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [statsKey, setStatsKey] = useState(0);
  const [tableKey, setTableKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const refreshData = () => {
    setStatsKey((prev) => prev + 1);
    setTableKey((prev) => prev + 1);
  };

  // Open modal automatically when an employee is selected from table
  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Branch Payroll Dashboard</h1>


      {/* Payroll Stats */}
      {branchId && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Branch Payroll Stats</h2>
            <PayrollStats
              key={statsKey}
              branchId={branchId}
              year={year}
              month={month}
              renderChart={(data) => {
                if (!data) return <p>No data</p>;
                const chartData = [
                  { name: "Paid", value: data.paidCount },
                  { name: "Pending", value: data.pendingCount },
                ];
                const COLORS = ["#4ade80", "#f87171"];

                return (
                  <div className="flex items-center gap-6">
                    <PieChart width={200} height={200}>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total Employees: {data.totalEmployees}</div>
                      <div>Paid: {data.paidCount}</div>
                      <div>Pending: {data.pendingCount}</div>
                      <div>Gross Salary: {data.totalGrossSalary}</div>
                      <div>Deductions: {data.totalDeductions}</div>
                      <div>Net Salary: {data.totalNetSalary}</div>
                    </div>
                  </div>
                );
              }}
            />
          </CardContent>
        </Card>
      )}
      <SalaryTable
  branchId={branchId}
  onSelectEmployee={(employeeId) => setEmployeeId(13)}
/>
      {/* Year/Month Filter */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Year</label>
          <select
            className="border p-1 rounded"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Month</label>
          <select
            className="border p-1 rounded"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      {branchId && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Payroll Records</h2>
            <PayrollTable
              key={tableKey}
              branchId={branchId}
              year={year}
              month={month}
              onSelectEmployee={handleSelectEmployee} // auto-fill modal
              onActionComplete={refreshData}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
