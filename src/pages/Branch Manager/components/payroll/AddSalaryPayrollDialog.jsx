"use client";

import { useState, useEffect } from "react";
import { useGetSalaryByEmployeeQuery, useSaveSalaryMutation } from "@/Redux Toolkit/features/salary/salaryApi";
import { useGeneratePayrollMutation } from "@/Redux Toolkit/features/payroll/payrollApi";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "./ConfirmDialog";

export default function AddSalaryPayrollDialog({ open, setOpen, employeeId: initialEmployeeId }) {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId || "");
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ action: null }); // "save" or "generate"

  const { data } = useGetSalaryByEmployeeQuery(Number(employeeId), { skip: !employeeId });
  const [saveSalary] = useSaveSalaryMutation();
  const [generatePayroll] = useGeneratePayrollMutation();

  // Update employeeId if initial prop changes
  useEffect(() => {
    setEmployeeId(initialEmployeeId || "");
  }, [initialEmployeeId]);

  // Populate form when data changes
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
  }, [data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleConfirmAction = async () => {
    if (!employeeId) return alert("Employee ID missing");

    try {
      if (confirmData.action === "save") {
        await saveSalary({ id: data?.id, employee: { id: Number(employeeId) }, ...form }).unwrap();
        alert("Salary saved successfully");
      } else if (confirmData.action === "generate") {
        await generatePayroll({ employeeId: Number(employeeId), year, month }).unwrap();
        alert("Payroll generated successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const handleActionClick = (action) => {
    setConfirmData({ action });
    setConfirmOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80%] max-h-[99vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Salary & Payroll</DialogTitle>
            <DialogDescription>
              Add or edit employee salary and generate payroll for the selected month.
            </DialogDescription>
          </DialogHeader>

          {/* Employee ID input */}
          <Input
            type="number"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="mb-2"
          />

          {/* Salary Form */}
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

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Input type="number" placeholder="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} />
            <Input type="number" placeholder="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
          </div>

          <DialogFooter className="flex flex-col gap-2">
            <Button onClick={() => handleActionClick("save")}>Save Salary</Button>
            <Button variant="secondary" onClick={() => handleActionClick("generate")}>Generate Payroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmData.action === "save" ? "Confirm Save Salary" : "Confirm Generate Payroll"}
        description={confirmData.action === "save"
          ? "Are you sure you want to save/update this salary?"
          : "Are you sure you want to generate payroll for this employee?"}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
