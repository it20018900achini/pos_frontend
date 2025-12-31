"use client";

import React, { useState, useEffect } from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Recursive function to compute total including children
const computeTotal = (acc) => {
  if (!acc.children || acc.children.length === 0) return acc.balance ?? 0;
  return acc.children.reduce((sum, child) => sum + computeTotal(child), 0);
};

// Recursive render for nested accounts
const renderNestedAccounts = (accounts, level = 0) =>
  accounts.flatMap((acc) => {
    const childrenRows = acc.children ? renderNestedAccounts(acc.children, level + 1) : [];
    const total = computeTotal(acc);

    return [
      <tr key={acc.id ?? acc.account} className={acc.children && acc.children.length > 0 ? "font-semibold" : ""}>
        <td style={{ paddingLeft: `${level * 20}px` }}>{acc.account}</td>
        <td align="right">{(acc.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        <td align="right">{acc.children && acc.children.length > 0 ? total.toLocaleString(undefined, { minimumFractionDigits: 2 }) : ""}</td>
      </tr>,
      ...childrenRows,
    ];
  });

// Render section (Assets / Liabilities / Equity)
const renderSectionTable = (title, accounts) => {
  const sectionTotal = accounts.reduce((sum, acc) => sum + computeTotal(acc), 0);

  return (
    <div className="overflow-x-auto mb-6">
      <div className="mb-2 font-semibold">{title}</div>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Account</th>
            <th className="py-2 px-4 border-b text-right">Balance</th>
            <th className="py-2 px-4 border-b text-right">Total</th>
          </tr>
        </thead>
        <tbody>{renderNestedAccounts(accounts)}</tbody>
        <tfoot>
          <tr className="font-bold bg-gray-50 border-t border-gray-300">
            <td className="py-2 px-4">Total {title}</td>
            <td></td>
            <td align="right">{sectionTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default function BalanceSheet() {
  // Default to current month
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

  // Refetch if dates change
  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  if (isLoading) return <p>Loading Balance Sheet...</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  const assets = data?.assets || [];
  const liabilities = data?.liabilities || [];
  const equity = data?.equity || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Balance Sheet</h2>
        <div className="flex space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={refetch}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>{renderSectionTable("Assets", assets)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liabilities & Equity</CardTitle>
        </CardHeader>
        <CardContent>
          {renderSectionTable("Liabilities", liabilities)}
          {renderSectionTable("Equity", equity)}
        </CardContent>
      </Card>
    </div>
  );
}
