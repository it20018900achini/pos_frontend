"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import { Card, CardContent } from "@/components/ui/card";
import ContentLayout from "../../Dashboard/ContentLayout";

import PayrollStats from "../components/payroll/PayrollStats";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function BranchPayrollDashboard() {

  /* ---------------- REDUX ---------------- */

  const { selectedBranchId } = useSelector((state) => state.user);
  const branchId = selectedBranchId;

  /* ---------------- STATE ---------------- */

  const [statsKey, setStatsKey] = useState(0);
  const [tableKey, setTableKey] = useState(0);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  /* ---------------- HELPERS ---------------- */

  const refreshData = () => {
    setStatsKey((prev) => prev + 1);
    setTableKey((prev) => prev + 1);
  };

  /* ---------------- CHART RENDER ---------------- */

  const renderPayrollChart = (data) => {
    if (!data) return <p>No data available</p>;

    const chartData = [
      { name: "Paid", value: data.paidCount },
      { name: "Pending", value: data.pendingCount },
    ];

    const COLORS = ["#4ade80", "#f87171"];

    return (
      <div className="flex flex-col md:flex-row items-center gap-6">

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
  };

  /* ---------------- UI ---------------- */

  return (

    <ContentLayout
      title="Payroll Dashboard"
      subTitle="Manage employee salaries and payroll overview"
    >

      <div className="space-y-6">

        {/* Payroll Statistics */}

        {branchId && (
          <Card>

            <CardContent className="p-6">

              <PayrollStats
                key={statsKey}
                branchId={branchId}
                year={year}
                month={month}
                renderChart={renderPayrollChart}
              />

            </CardContent>

          </Card>
        )}

      </div>

    </ContentLayout>

  );
}