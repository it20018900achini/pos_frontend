import { useState } from "react";
import { useGeneratePayrollMutation } from "@/Redux Toolkit/features/payroll/payrollApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PayrollForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [generatePayroll] = useGeneratePayrollMutation();

  const handleGenerate = async () => {
    if (!employeeId) return alert("Enter Employee ID");

    try {
      await generatePayroll({ employeeId: Number(employeeId), year, month });
      alert("Payroll generated successfully");
    } catch (err) {
      console.error(err);
      alert("Error generating payroll");
    }
  };

  return (
    <Card className="max-w-2xl mt-4">
      <CardContent className="p-6 space-y-4">
        <Input type="number" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input type="number" placeholder="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          <Input type="number" placeholder="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        </div>
        <Button className="w-full" onClick={handleGenerate}>Generate Payroll</Button>
      </CardContent>
    </Card>
  );
}
