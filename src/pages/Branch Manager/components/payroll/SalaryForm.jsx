// src/components/payroll/SalaryForm.jsx
import { useState, useEffect } from "react";
import { useGetSalaryByEmployeeQuery, useSaveSalaryMutation } from "@/Redux Toolkit/features/salary/salaryApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SalaryForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [form, setForm] = useState({
    basicSalary: "", hra: "", transport: "", medical: "",
    overtimeRate: "", epfPercentage: "", etfPercentage: "",
  });

  const { data } = useGetSalaryByEmployeeQuery(Number(employeeId), { skip: !employeeId });
  const [saveSalary] = useSaveSalaryMutation();

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async () => {
    if (!employeeId) return alert("Enter employee ID");
    await saveSalary({ employee: { id: Number(employeeId) }, ...form });
    alert("Salary saved");
  };

  return (
    <Card className="max-w-2xl">
      <CardContent className="p-6 space-y-4">
        <Input placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
        <Input name="basicSalary" placeholder="Basic Salary" value={form.basicSalary} onChange={handleChange} />
        {/* Add other inputs similarly */}
        <Button onClick={handleSubmit}>Save Salary</Button>
      </CardContent>
    </Card>
  );
}
