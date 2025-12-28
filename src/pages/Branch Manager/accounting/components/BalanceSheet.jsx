"use client";

import React from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Recursive function to render nested accounts in table rows
const renderAccountRows = (accounts, level = 0) => {
  return accounts.flatMap((acc) => {
    const isNegative = acc.balance != null && acc.balance < 0;
    const row = (
      <tr key={acc.id ?? acc.account}>
        <td style={{ paddingLeft: `${level * 20}px` }}>
          {acc.account}
        </td>
        <td className={isNegative ? "text-red-600" : ""} align="right">
          {acc.balance != null
            ? acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })
            : "0.00"}
        </td>
      </tr>
    );

    if (acc.children && acc.children.length > 0) {
      return [row, ...renderAccountRows(acc.children, level + 1)];
    } else {
      return [row];
    }
  });
};

// Table renderer for a section (Assets, Liabilities, Equity)
const renderSectionTable = (title, accounts, total) => (
  <div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Account</th>
            <th className="py-2 px-4 border-b text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {renderAccountRows(accounts)}
        </tbody>
        <tfoot>
          <tr className="font-semibold bg-gray-50">
            <td className="py-2 px-4 border-t">Total {title}</td>
            <td className="py-2 px-4 border-t text-right">
              {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

export default function BalanceSheet() {
  const { data, isLoading, isError, refetch } = useGetBalanceSheetQuery();

  if (isLoading) return <p>Loading Balance Sheet...</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  const assets = data?.assets || [];
  const liabilities = data?.liabilities || [];
  const equity = data?.equity || [];

  const totalAssets = data?.totalAssets ?? 0;
  const totalLiabilities = data?.totalLiabilities ?? 0;
  const totalEquity = data?.totalEquity ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Balance Sheet</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>{renderSectionTable("Assets", assets, totalAssets)}</CardContent>
      </Card>

      {/* Liabilities & Equity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liabilities & Equity</CardTitle>
        </CardHeader>
        <CardContent>
          {renderSectionTable("Liabilities", liabilities, totalLiabilities)}
          <div className="mt-4">
            {renderSectionTable("Equity", equity, totalEquity)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
