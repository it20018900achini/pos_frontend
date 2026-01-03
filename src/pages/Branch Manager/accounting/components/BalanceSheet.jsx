"use client";

import React, { useState, useEffect } from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ===================== HELPERS ===================== */
// Recursively compute total balance
const computeTotal = (acc) =>
  !acc.children || acc.children.length === 0
    ? acc.balance ?? 0
    : acc.children.reduce((sum, c) => sum + computeTotal(c), 0);

const formatAmount = (val) =>
  (val ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

/* ===================== ROW RENDER ===================== */
const BalanceRow = ({ acc, level, expanded, toggle }) => {
  const hasChildren = acc.children?.length > 0;
  const isExpanded = expanded.has(acc.id);
  const total = computeTotal(acc);

  const colorClass =
    acc.balance > 0 ? "text-green-700" : acc.balance < 0 ? "text-red-600" : "text-gray-800";

  return (
    <>
      <tr
        className={`hover:bg-gray-50 transition-all duration-150 ${
          hasChildren ? "font-semibold bg-gray-100" : ""
        }`}
      >
        <td className="py-1 px-2" style={{ paddingLeft: `${level * 25}px` }}>
          {hasChildren && (
            <button
              onClick={() => toggle(acc.id)}
              className="mr-2 text-sm font-bold text-gray-600 hover:text-gray-800"
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          {acc.account}
        </td>
        <td className={`py-1 px-2 text-right ${colorClass}`}>{formatAmount(acc.balance)}</td>
        <td className="py-1 px-2 text-right">{hasChildren ? formatAmount(total) : ""}</td>
      </tr>

      {hasChildren &&
        isExpanded &&
        acc.children.map((child) => (
          <BalanceRow
            key={child.id ?? child.account}
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
            <th className="text-right p-2">Balance</th>
            <th className="text-right p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <BalanceRow
              key={acc.id ?? acc.account}
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
            <td className="p-2 text-right">{formatAmount(sectionTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

/* ===================== MAIN COMPONENT ===================== */
export default function BalanceSheet() {
  const [expanded, setExpanded] = useState(new Set());

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data, isLoading, isError, refetch } = useGetBalanceSheetQuery({
    start: `${startDate}T00:00:00`,
    end: `${endDate}T23:59:59`,
  });

  /* ===================== SAFE ASYNC REFETCH ===================== */
  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    fetchData();
  }, [startDate, endDate, refetch]);

  if (isLoading) return <p>Loading Balance Sheet…</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  const assets = data?.assets || [];
  const liabilities = data?.liabilities || [];
  const equity = data?.equity || [];

  const assetsTotal = assets.reduce((s, a) => s + computeTotal(a), 0);
  const liabilitiesTotal = liabilities.reduce((s, a) => s + computeTotal(a), 0);
  const equityTotal = equity.reduce((s, a) => s + computeTotal(a), 0);

  const isBalanced = Math.abs(assetsTotal - (liabilitiesTotal + equityTotal)) < 0.01;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Balance Sheet</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      <div
        className={`p-3 rounded-lg border font-semibold ${
          isBalanced
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-red-50 text-red-700 border-red-400"
        }`}
      >
        <div className="flex justify-between">
          <span>Assets</span>
          <span>{assetsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Liabilities + Equity</span>
          <span>{(liabilitiesTotal + equityTotal).toFixed(2)}</span>
        </div>
        {!isBalanced && <div>⚠ Balance Sheet NOT balanced</div>}
      </div>

      <SectionTable title="Assets" accounts={assets} expanded={expanded} toggle={toggle} />
      <SectionTable title="Liabilities" accounts={liabilities} expanded={expanded} toggle={toggle} />
      <SectionTable title="Equity" accounts={equity} expanded={expanded} toggle={toggle} />
    </div>
  );
}
