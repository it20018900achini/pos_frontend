"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  useGetBranchPayrollsQuery,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
  useCancelPayrollMutation, // <-- new mutation
} from "@/Redux Toolkit/features/payroll/payrollApi";

export default function PayrollTable({ branchId, year, month, onSelectEmployee, onActionComplete }) {
  const { data: payrolls, isLoading, error } = useGetBranchPayrollsQuery({ branchId, year, month });
  const [approvePayroll] = useApprovePayrollMutation();
  const [markPaid] = useMarkPayrollPaidMutation();
  const [cancelPayroll] = useCancelPayrollMutation();

  if (isLoading) return <p>Loading payrolls...</p>;
  if (error) return <p>Error loading payrolls</p>;
  if (!payrolls?.length) return <p>No payrolls found</p>;

  const handleApprove = async (id) => {
    await approvePayroll(id);
    onActionComplete?.();
  };

  const handleMarkPaid = async (id) => {
    await markPaid({ payrollId: id });
    onActionComplete?.();
  };

  const handleCancel = async (id) => {
    await cancelPayroll(id);
    onActionComplete?.();
  };

  const statusColors = {
    DRAFT: "bg-gray-300 text-gray-800",
    APPROVED: "bg-blue-300 text-blue-800",
    PAID: "bg-green-300 text-green-800",
    CANCELLED: "bg-red-300 text-red-800",
    PENDING: "bg-orange-300 text-orange-800",
  };

  return (
    <table className="w-full table-auto border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Employee</th>
          <th className="p-2 border">Basic Salary</th>
          <th className="p-2 border">Allowances</th>
          <th className="p-2 border">Deductions</th>
          <th className="p-2 border">Gross Salary</th>
          <th className="p-2 border">Net Salary</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {payrolls.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50 cursor-pointer">
            <td className="p-2 border" onClick={() => onSelectEmployee?.(p.employee.id)}>
              {p.employee.name}
            </td>
            <td className="p-2 border">{p.basicSalary}</td>
            <td className="p-2 border">{p.allowances}</td>
            <td className="p-2 border">{p.totalDeductions}</td>
            <td className="p-2 border">{p.grossSalary}</td>
            <td className="p-2 border">{p.netSalary}</td>
            <td className="p-2 border">
              <Badge className={statusColors[p.status] || "bg-gray-300 text-gray-800"}>
                {p.status}
              </Badge>
            </td>
            <td className="p-2 border flex gap-2">
              {p.status === "DRAFT" && (
                <Button size="sm" onClick={() => handleApprove(p.id)}>Approve</Button>
              )}
              {p.status === "APPROVED" && (
                <Button size="sm" onClick={() => handleMarkPaid(p.id)}>Mark Paid</Button>
              )}
              {(p.status === "DRAFT" || p.status === "APPROVED" || p.status === "PENDING") && (
                <Button size="sm" variant="destructive" onClick={() => handleCancel(p.id)}>Cancel</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
