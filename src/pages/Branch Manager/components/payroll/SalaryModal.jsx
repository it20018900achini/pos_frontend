import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSaveEmployeeSalaryMutation } from "@/Redux Toolkit/features/payroll/payrollApi";
import { useState } from "react";

export default function SalaryModal({ open, onClose, employeeId }) {
  const [saveSalary] = useSaveEmployeeSalaryMutation();

  const [form, setForm] = useState({
    employee: { id: employeeId },
    basicSalary: "",
    hra: "",
    transport: "",
    medical: "",
    epfPercentage: 8,
    etfPercentage: 3,
  });

  const submit = async () => {
    await saveSalary(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Salary</DialogTitle>
        </DialogHeader>

        <Input placeholder="Basic Salary"
          onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} />

        <Input placeholder="HRA"
          onChange={(e) => setForm({ ...form, hra: e.target.value })} />

        <Input placeholder="Transport"
          onChange={(e) => setForm({ ...form, transport: e.target.value })} />

        <Input placeholder="Medical"
          onChange={(e) => setForm({ ...form, medical: e.target.value })} />

        <Button onClick={submit}>Save Salary</Button>
      </DialogContent>
    </Dialog>
  );
}
