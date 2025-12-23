"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SalaryForm from "./SalaryForm";
import PayrollForm from "./PayrollForm";

export default function SalaryPayrollModal({ employeeId, setEmployeeId, year, month, onCompleted }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || "");
  const [tab, setTab] = useState("salary");

  useEffect(() => {
    if (employeeId) setSelectedEmployee(employeeId);
  }, [employeeId]);

  const handleCompleted = () => {
    onCompleted?.();
    setModalOpen(false);
    setTab("salary"); // reset to first tab next time
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button disabled={!selectedEmployee}>Add/Edit Salary & Generate Payroll</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle>Salary & Payroll</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="salary">Step 1: Salary</TabsTrigger>
            <TabsTrigger value="payroll" disabled={!selectedEmployee}>Step 2: Payroll</TabsTrigger>
          </TabsList>

          {/* Step 1: Salary */}
          <TabsContent value="salary">
            <SalaryForm
              employeeId={selectedEmployee}
              setEmployeeId={setSelectedEmployee}
            />
            <div className="flex justify-end mt-4">
              <Button
                disabled={!selectedEmployee}
                onClick={() => setTab("payroll")}
              >
                Next: Generate Payroll
              </Button>
            </div>
          </TabsContent>

          {/* Step 2: Payroll */}
          <TabsContent value="payroll">
            <PayrollForm
              employeeId={selectedEmployee}
              year={year}
              month={month}
              onPayrollGenerated={handleCompleted}
            />
            <div className="flex justify-start mt-4">
              <Button variant="outline" onClick={() => setTab("salary")}>
                Back to Salary
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
