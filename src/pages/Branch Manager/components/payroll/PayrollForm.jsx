"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGeneratePayrollMutation } from "@/Redux Toolkit/features/payroll/payrollApi";

export default function PayrollForm({ employeeId, year, month, onPayrollGenerated }) {
  const [generatePayroll] = useGeneratePayrollMutation();

  const handleGenerate = async () => {
    if (!employeeId) return alert("Select or enter an Employee ID first");

    try {
      await generatePayroll({ employeeId: Number(employeeId), year, month }).unwrap();
      alert("Payroll generated successfully");
      onPayrollGenerated?.();
    } catch (err) {
      console.error(err);
      alert("Error generating payroll");
    }
  };

  return (
    <Card className="max-w-2xl mt-4">
      <CardContent className="p-6 space-y-4">
        <Input type="number" placeholder="Employee ID" value={employeeId} readOnly />
        <div className="grid grid-cols-2 gap-4">
          <Input type="number" placeholder="Year" value={year} readOnly />
          <Input type="number" placeholder="Month" value={month} readOnly />
        </div>
        <Button className="w-full" onClick={handleGenerate}>Generate Payroll</Button>
      </CardContent>
    </Card>
  );
}
