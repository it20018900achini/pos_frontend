import { useEffect, useState } from "react";
import {
  useGetSalaryByEmployeeQuery,
  useSaveSalaryMutation,
} from "@/Redux Toolkit/features/salary/salaryApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SalaryForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [form, setForm] = useState({
    basicSalary: "",
    hra: "",
    transport: "",
    medical: "",
    overtimeRate: "",
    epfPercentage: "",
    etfPercentage: "",
  });

  const { data: salaryData, isLoading } = useGetSalaryByEmployeeQuery(
    Number(employeeId),
    { skip: !employeeId }
  );

  const [saveSalary] = useSaveSalaryMutation();

  useEffect(() => {
    if (salaryData) {
      setForm({
        basicSalary: salaryData.basicSalary ?? "",
        hra: salaryData.hra ?? "",
        transport: salaryData.transport ?? "",
        medical: salaryData.medical ?? "",
        overtimeRate: salaryData.overtimeRate ?? "",
        epfPercentage: salaryData.epfPercentage ?? "",
        etfPercentage: salaryData.etfPercentage ?? "",
      });
    } else {
      setForm({
        basicSalary: "",
        hra: "",
        transport: "",
        medical: "",
        overtimeRate: "",
        epfPercentage: "",
        etfPercentage: "",
      });
    }
  }, [salaryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!employeeId) return alert("Please enter employee ID");

    try {
      await saveSalary({
        employee: { id: Number(employeeId) },
        basicSalary: Number(form.basicSalary),
        hra: Number(form.hra),
        transport: Number(form.transport),
        medical: Number(form.medical),
        overtimeRate: Number(form.overtimeRate),
        epfPercentage: Number(form.epfPercentage),
        etfPercentage: Number(form.etfPercentage),
      }).unwrap();

      alert("Salary saved successfully");
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to save salary");
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardContent className="p-6 space-y-4">

        {/* Employee ID Input */}
        <Input
          type="number"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />

        {/* Salary Inputs */}
        <Input
          type="number"
          step="0.01"
          name="basicSalary"
          placeholder="Basic Salary"
          value={form.basicSalary}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input type="number" step="0.01" name="hra" placeholder="HRA" value={form.hra} onChange={handleChange} />
          <Input type="number" step="0.01" name="transport" placeholder="Transport Allowance" value={form.transport} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input type="number" step="0.01" name="medical" placeholder="Medical Allowance" value={form.medical} onChange={handleChange} />
          <Input type="number" step="0.01" name="overtimeRate" placeholder="Overtime Rate / Hour" value={form.overtimeRate} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input type="number" step="0.01" name="epfPercentage" placeholder="EPF %" value={form.epfPercentage} onChange={handleChange} />
          <Input type="number" step="0.01" name="etfPercentage" placeholder="ETF %" value={form.etfPercentage} onChange={handleChange} />
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Save Salary
        </Button>

      </CardContent>
    </Card>
  );
}
