import { useState } from "react";
import SalaryForm from "../components/payroll/SalaryForm";
import PayrollForm from "../components/payroll/PayrollForm";
import PayrollStats from "../components/payroll/PayrollStats";
import { Card, CardContent } from "@/components/ui/card";

export default function PayrollPage() {
  // State to share employeeId between SalaryForm and PayrollForm
  const [employeeId, setEmployeeId] = useState("");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-4">Branch Payroll Dashboard</h1>

      {/* Salary Form */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Add / Edit Employee Salary</h2>
          <SalaryForm employeeId={employeeId} setEmployeeId={setEmployeeId} />
        </CardContent>
      </Card>

      {/* Payroll Form */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Generate Payroll</h2>
          <PayrollForm employeeId={employeeId} />
        </CardContent>
      </Card>

      {/* Payroll Stats */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Branch Payroll Stats</h2>
          <PayrollStats />
        </CardContent>
      </Card>
    </div>
  );
}
