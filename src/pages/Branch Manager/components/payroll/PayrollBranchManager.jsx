import { useState } from "react";
import {
  useGeneratePayrollMutation,
  useGetBranchPayrollQuery,
  useApprovePayrollMutation,
  usePayPayrollMutation,
} from "@/Redux Toolkit/features/payroll/payrollApi";
import PayrollTable from "./PayrollTable";
import PayrollStats from "./PayrollStats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import SalarySetup from "../salary/SalarySetup";

export default function PayrollBranchManager({ branchId=52 }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [employeeId, setEmployeeId] = useState("");
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [pendingPayroll, setPendingPayroll] = useState(null);
  const [error, setError] = useState(null);

  const { data: payrolls = [], isLoading } = useGetBranchPayrollQuery({ branchId, year, month });
  const [generatePayroll] = useGeneratePayrollMutation();
  const [approvePayroll] = useApprovePayrollMutation();
  const [payPayroll] = usePayPayrollMutation();

  const handleGenerate = async () => {
    setError(null);
    try {
      await generatePayroll({ employeeId, year, month }).unwrap();
    } catch (err) {
      if (err.data?.message === "Salary not configured") {
        setPendingPayroll({ employeeId, year, month });
        setSalaryModalOpen(true);
      } else {
        setError(err.data?.message || "Failed to generate payroll");
      }
    }
  };

  const handleSalarySaved = async () => {
    setSalaryModalOpen(false);
    if (pendingPayroll) {
      await generatePayroll(pendingPayroll).unwrap();
      setPendingPayroll(null);
    }
  };

  const handleApprove = async (id) => await approvePayroll(id).unwrap();
  const handlePay = async (id) => await payPayroll({ id }).unwrap();

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-end">
        <Input type="number" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        <Button onClick={handleGenerate}>{isLoading ? "Generating..." : "Generate Payroll"}</Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <PayrollStats payrolls={payrolls} />

      <PayrollTable data={payrolls} onApprove={handleApprove} onPay={handlePay} />

      <Dialog open={salaryModalOpen} onOpenChange={setSalaryModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Salary Setup</DialogTitle>
          </DialogHeader>

          {pendingPayroll && <SalarySetup employeeId={pendingPayroll.employeeId} onSaved={handleSalarySaved} />}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSalaryModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
