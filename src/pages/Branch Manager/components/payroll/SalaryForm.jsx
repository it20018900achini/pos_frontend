"use client";

import { useEffect, useState } from "react";
import { useGetSalaryByEmployeeQuery, useSaveSalaryMutation } from "@/Redux Toolkit/features/salary/salaryApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SalaryForm({ employeeId: selectedEmployeeId, setEmployeeId: setParentEmployeeId }) {
  const [employeeId, setEmployeeId] = useState(selectedEmployeeId || "");
  const [form, setForm] = useState({
    basicSalary: "",
    hra: "",
    transport: "",
    medical: "",
    overtimeRate: "",
    epfPercentage: "",
    etfPercentage: "",
  });

  const { data } = useGetSalaryByEmployeeQuery(Number(employeeId), { skip: !employeeId });
  const [saveSalary] = useSaveSalaryMutation();

  // Sync prop employeeId from parent
  useEffect(() => {
    if (selectedEmployeeId) setEmployeeId(selectedEmployeeId);
  }, [selectedEmployeeId]);

  // Reset form when employeeId changes
  useEffect(() => {
    setForm({
      basicSalary: "",
      hra: "",
      transport: "",
      medical: "",
      overtimeRate: "",
      epfPercentage: "",
      etfPercentage: "",
    });
  }, [employeeId]);

  // Populate form if salary exists
  useEffect(() => {
    if (data) {
      setForm({
        basicSalary: data.basicSalary ?? "",
        hra: data.hra ?? "",
        transport: data.transport ?? "",
        medical: data.medical ?? "",
        overtimeRate: data.overtimeRate ?? "",
        epfPercentage: data.epfPercentage ?? "",
        etfPercentage: data.etfPercentage ?? "",
      });
    }
  }, [data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!employeeId) return alert("Enter Employee ID");

    try {
      await saveSalary({
        id: data?.id,
        employee: { id: Number(employeeId) },
        ...form,
      }).unwrap();

      alert("Salary saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving salary");
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardContent className="p-4 space-y-4">

        {/* Employee Info */}
        {data?.employee && (
          <div className="p-3 border rounded bg-gray-50 text-sm space-y-1">
            <div><strong>Name:</strong> {data.employee.fullName}</div>
            <div><strong>Phone:</strong> {data.employee.phone}</div>
            <div><strong>Email:</strong> {data.employee.email}</div>
          </div>
        )}

        {/* Employee ID input */}
        <Input
          type="number"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => {
            setEmployeeId(e.target.value);
            setParentEmployeeId?.(e.target.value);
          }}
        />

        {/* Salary Fields */}
        <Input name="basicSalary" type="number" placeholder="Basic Salary" value={form.basicSalary} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
          <Input name="hra" type="number" placeholder="HRA" value={form.hra} onChange={handleChange} />
          <Input name="transport" type="number" placeholder="Transport" value={form.transport} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input name="medical" type="number" placeholder="Medical" value={form.medical} onChange={handleChange} />
          <Input name="overtimeRate" type="number" placeholder="Overtime Rate / Hour" value={form.overtimeRate} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input name="epfPercentage" type="number" placeholder="EPF %" value={form.epfPercentage} onChange={handleChange} />
          <Input name="etfPercentage" type="number" placeholder="ETF %" value={form.etfPercentage} onChange={handleChange} />
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Save Salary
        </Button>
      </CardContent>
    </Card>
  );
}
