import { useState } from "react";
import { useSelector } from "react-redux";

import SalaryForm from "@/components/payroll/SalaryForm";
import PayrollForm from "@/components/payroll/PayrollForm";
import PayrollStats from "@/components/payroll/PayrollStats";

import { Card, CardContent } from "@/components/ui/card";

// Optional: Chart library
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function BranchPayrollDashboard() {
  const { branch } = useSelector((state) => state.branch);
  const branchId = branch?.id;

  // Share employeeId between forms
  const [employeeId, setEmployeeId] = useState("");

  // Track stats data to use in chart
  const [statsKey, setStatsKey] = useState(0);

  // Callback after payroll is generated to refresh stats
  const handlePayrollGenerated = () => {
    setStatsKey((prev) => prev + 1); // Forces re-render & refetch
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Branch Payroll Dashboard</h1>

      {/* Salary Form */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">
            Add / Edit Employee Salary
          </h2>
          <SalaryForm
            employeeId={employeeId}
            setEmployeeId={setEmployeeId}
          />
        </CardContent>
      </Card>

      {/* Payroll Form */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">
            Generate Payroll
          </h2>

          {branchId ? (
            <PayrollForm
              employeeId={employeeId}
              onPayrollGenerated={handlePayrollGenerated}
            />
          ) : (
            <p className="text-sm text-gray-500">
              Load branch info to enable payroll
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payroll Stats */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">
            Branch Payroll Stats
          </h2>

          {branchId ? (
            <PayrollStats
              key={statsKey} // Forces re-fetch after payroll generation
              branchId={branchId}
            />
          ) : (
            <p className="text-sm text-gray-500">
              Loading branch information...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Optional: Pie Chart for Paid vs Pending */}
      {branchId && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">
              Monthly Payroll Summary
            </h2>
            <PayrollStats
              key={`chart-${statsKey}`}
              branchId={branchId}
              renderChart={(data) => {
                const chartData = [
                  { name: "Paid", value: data.paidCount },
                  { name: "Pending", value: data.pendingCount },
                ];
                const COLORS = ["#4ade80", "#f87171"]; // green / red
                return (
                  <PieChart width={300} height={200}>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                );
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
