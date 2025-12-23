"use client";

import { useState, useEffect } from "react";
import { useGetSalaryByEmployeeQuery, useSaveSalaryMutation } from "@/Redux Toolkit/features/salary/salaryApi";
import { useGeneratePayrollMutation } from "@/Redux Toolkit/features/payroll/payrollApi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SalaryPayrollDialog() {
  const [open, setOpen] = useState(false);
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

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  // Fetch salary & employee info
  const { data } = useGetSalaryByEmployeeQuery(Number(employeeId), { skip: !employeeId });
  const [saveSalary] = useSaveSalaryMutation();
  const [generatePayroll] = useGeneratePayrollMutation();

  // Populate form if salary exists
  useEffect(() => {
    if (data?.employee) {
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

  // Reset form if employeeId is empty or data not available
  useEffect(() => {
    if (!employeeId || !data?.employee) {
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
  }, [employeeId, data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSaveSalary = async () => {
    if (!employeeId) return alert("Enter Employee ID");
    try {
      await saveSalary({
        id: data?.id, // pass existing salary ID to update
        employee: { id: Number(employeeId) },
        ...form,
      }).unwrap();
      alert("Salary saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving salary");
    }
  };

  const handleGeneratePayroll = async () => {
    if (!employeeId) return alert("Enter Employee ID");
    try {
      await generatePayroll({ employeeId: Number(employeeId), year, month }).unwrap();
      alert("Payroll generated successfully");
    } catch (err) {
      console.error(err);
      alert("Error generating payroll");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Manage Salary & Payroll</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Employee Salary & Payroll</DialogTitle>
          <DialogDescription>
            Add or edit employee salary and generate payroll for the selected month.
          </DialogDescription>
        </DialogHeader>

        {/* Employee Info or Not Found Message */}
        {data?.employee ? (
          <div className="p-3 border rounded bg-gray-50 text-sm space-y-1 mb-4">
            <div><strong>Name:</strong> {data.employee.fullName}</div>
            <div><strong>Phone:</strong> {data.employee.phone}</div>
            <div><strong>Email:</strong> {data.employee.email}</div>
          </div>
        ) : (
          employeeId && <p className="text-sm text-red-500 mb-4">No employee found for ID {employeeId}</p>
        )}

        {/* Employee ID */}
        <Input
          type="number"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="mb-2"
        />

        {/* Salary Fields */}
        <Input name="basicSalary" type="number" placeholder="Basic Salary" value={form.basicSalary} onChange={handleChange} className="mb-2" />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Input name="hra" type="number" placeholder="HRA" value={form.hra} onChange={handleChange} />
          <Input name="transport" type="number" placeholder="Transport" value={form.transport} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Input name="medical" type="number" placeholder="Medical" value={form.medical} onChange={handleChange} />
          <Input name="overtimeRate" type="number" placeholder="Overtime Rate / Hour" value={form.overtimeRate} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Input name="epfPercentage" type="number" placeholder="EPF %" value={form.epfPercentage} onChange={handleChange} />
          <Input name="etfPercentage" type="number" placeholder="ETF %" value={form.etfPercentage} onChange={handleChange} />
        </div>

        {/* Payroll Month/Year */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Input type="number" placeholder="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          <Input type="number" placeholder="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        </div>

        <DialogFooter className="flex flex-col gap-2">
          <Button onClick={handleSaveSalary}>Save Salary</Button>
          <Button variant="secondary" onClick={handleGeneratePayroll}>Generate Payroll</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
