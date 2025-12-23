// src/components/payroll/PayrollAdmin.jsx
import PayrollStats from "./PayrollStats";
import PayrollTable from "./PayrollTable";
import GeneratePayrollModal from "./GeneratePayrollModal";
import SalaryForm from "./SalaryForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PayrollAdmin() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <SalaryForm />
      <PayrollStats />
      <Button onClick={() => setModalOpen(true)}>Generate Payroll</Button>
      <PayrollTable />
      <GeneratePayrollModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
