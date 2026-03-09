"use client";

import React, { useState, useMemo } from "react";
import { useGetProfitLossQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ContentLayout from "../../../Dashboard/ContentLayout";
import { useSelector } from "react-redux";

/* ===================== HELPERS ===================== */

// Recursively compute total for an account and its children
const computeTotal = (acc) => {
  if (!acc.children || acc.children.length === 0) return acc.credit - acc.debit;
  return acc.children.reduce((sum, c) => sum + computeTotal(c), 0);
};

// Format numbers
const formatAmount = (val) =>
  val.toLocaleString(undefined, { minimumFractionDigits: 2 });

/* ===================== ROW COMPONENT ===================== */
const AccountRow = ({ acc, level, expanded, toggle }) => {
  const hasChildren = acc.children?.length > 0;
  const isExpanded = expanded.has(acc.id);
  const total = computeTotal(acc);

  return (
    <>
      <tr className={`hover:bg-gray-50 transition-all duration-150 ${hasChildren ? "font-semibold bg-gray-100" : ""}`}>
        <td className="py-1 px-2" style={{ paddingLeft: `${level * 25}px` }}>
          {hasChildren && (
            <button
              onClick={() => toggle(acc.id)}
              className="mr-2 text-sm font-bold text-gray-600 hover:text-gray-800"
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          {acc.accountName}
        </td>
        <td className="py-1 px-2">{acc.accountCode}</td>
        <td className="py-1 px-2 text-right">{formatAmount(acc.debit)}</td>
        <td className="py-1 px-2 text-right">{formatAmount(acc.credit)}</td>
        <td className="py-1 px-2 text-right">{hasChildren ? formatAmount(total) : ""}</td>
      </tr>

      {hasChildren && isExpanded && acc.children.map((child) => (
        <AccountRow
          key={child.id ?? child.accountCode}
          acc={child}
          level={level + 1}
          expanded={expanded}
          toggle={toggle}
        />
      ))}
    </>
  );
};

/* ===================== SECTION TABLE ===================== */
const SectionTable = ({ title, accounts, expanded, toggle }) => {
  const sectionTotal = accounts.reduce((sum, a) => sum + computeTotal(a), 0);

  return (
    <div className="mb-6 shadow-md rounded-lg overflow-hidden border">
      <div className="bg-gray-100 px-4 py-2 font-bold text-lg">{title}</div>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left p-2">Account</th>
            <th className="text-left p-2">Code</th>
            <th className="text-right p-2">Debit</th>
            <th className="text-right p-2">Credit</th>
            <th className="text-right p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <AccountRow
              key={acc.id ?? acc.accountCode}
              acc={acc}
              level={0}
              expanded={expanded}
              toggle={toggle}
            />
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-bold border-t">
          <tr>
            <td className="p-2">Total {title}</td>
            <td></td>
            <td className="p-2 text-right">{formatAmount(accounts.reduce((s, a) => s + (a.debit || 0), 0))}</td>
            <td className="p-2 text-right">{formatAmount(accounts.reduce((s, a) => s + (a.credit || 0), 0))}</td>
            <td className="p-2 text-right">{formatAmount(sectionTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

/* ===================== MAIN COMPONENT ===================== */
export default function ProfitLossReport() {
  const today = new Date();
const {selectedBranchId}=useSelector((state)=>state.user)
  const defaultStart = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
    [today]
  );
  const defaultEnd = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    [today]
  );

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  const [expanded, setExpanded] = useState(new Set());

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const { data: report, isLoading, isError, refetch } = useGetProfitLossQuery({branchId:selectedBranchId, start, end });

  if (isLoading) return <p>Loading Profit & Loss...</p>;
  if (isError) return <p>Error loading report.{selectedBranchId}</p>;

  const incomes = report?.incomes || [];
  const expenses = report?.expenses || [];

  const totalIncome = incomes.reduce((s, a) => s + computeTotal(a), 0);
  const totalExpense = expenses.reduce((s, a) => s + computeTotal(a), 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <ContentLayout title="Profit & Loss Statement" subTitle="View your profit and loss for a specific period." >
    <div className="space-y-6">

      {/* Date Inputs */}
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <label>
          Start:
          <Input
            type="date"
            value={format(new Date(start), "yyyy-MM-dd")}
            onChange={(e) => {
              const d = new Date(e.target.value);
              d.setHours(0, 0, 0, 0);
              setStart(d.toISOString());
            }}
            className="ml-2"
          />
        </label>
        <label>
          End:
          <Input
            type="date"
            value={format(new Date(end), "yyyy-MM-dd")}
            onChange={(e) => {
              const d = new Date(e.target.value);
              d.setHours(23, 59, 59, 999);
              setEnd(d.toISOString());
            }}
            className="ml-2"
          />
        </label>
        <Button onClick={refetch} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-300 text-green-800">
          <CardContent>
            <div className="text-sm font-medium">Total Income</div>
            <div className="text-xl font-bold">{formatAmount(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-300 text-red-800">
          <CardContent>
            <div className="text-sm font-medium">Total Expenses</div>
            <div className="text-xl font-bold">{formatAmount(totalExpense)}</div>
          </CardContent>
        </Card>
        <Card className={`${netProfit >= 0 ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"} border`}>
          <CardContent>
            <div className="text-sm font-medium">Net Profit / Loss</div>
            <div className="text-xl font-bold">{formatAmount(netProfit)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <SectionTable title="INCOME" accounts={incomes} expanded={expanded} toggle={toggle} />
      <SectionTable title="EXPENSES" accounts={expenses} expanded={expanded} toggle={toggle} />
    </div>
    </ContentLayout>
  );
}
