// src/components/payroll/GeneratePayrollModal.jsx
import { useState } from "react";
import { useGeneratePayrollMutation } from "@/Redux Toolkit/features/payroll/payrollApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GeneratePayrollModal({ open, onClose }) {
  const [employeeId, setEmployeeId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [generatePayroll] = useGeneratePayrollMutation();

  const handleSubmit = async () => {
    if (!employeeId) return alert("Enter employee ID");
    await generatePayroll({ employeeId: Number(employeeId), year, month });
    alert("Payroll generated");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Generate Payroll</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
          <Input placeholder="Year" value={year} onChange={e => setYear(Number(e.target.value))} />
          <Input placeholder="Month" value={month} onChange={e => setMonth(Number(e.target.value))} />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
