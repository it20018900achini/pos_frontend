"use client";

import React from "react";
import { useGetBalanceSheetQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Compute total of leaf nodes under a node
const computeLeafTotal = (acc) => {
  if (!acc.children || acc.children.length === 0) return acc.balance ?? 0;
  return acc.children.reduce((sum, child) => sum + computeLeafTotal(child), 0);
};

// Recursive render function
const renderAccountRows = (accounts, level = 0, isTopLevel = true) => {
  return accounts.flatMap((acc) => {
    const isLeaf = !acc.children || acc.children.length === 0;
    const childrenRows = acc.children ? renderAccountRows(acc.children, level + 1, false) : [];

    // Leaf row
    const leafRow = (
      <tr key={acc.id ?? acc.account}>
        <td style={{ paddingLeft: `${level * 20}px` }}>{acc.account}</td>
        <td align="right">
          {isLeaf ? (acc.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) : ""}
        </td>
        <td align="right">
          {/* {isLeaf ? (acc.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) : ""} */}
        </td>
      </tr>
    );

    // Subtotal row for direct children (not top-level)
    let subtotalRow = null;
    if (!isLeaf && !isTopLevel) {
      const subtotal = computeLeafTotal(acc);
      subtotalRow = (
        <tr key={acc.id + "-subtotal"} className="font-semibold border-t border-gray-200">
          <td style={{ paddingLeft: `${level * 20}px` }}>{acc.account} Total</td>
          <td></td>
          <td align="right">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        </tr>
      );
    }

    // Separator after each child subtotal
    const separatorRow = !isLeaf && !isTopLevel ? (
      <tr key={acc.id + "-sep"}>
        <td colSpan={3} className="border-t border-gray-300"></td>
      </tr>
    ) : null;

    return [leafRow, ...childrenRows, subtotalRow, separatorRow].filter(Boolean);
  });
};

// Section table
const renderSectionTable = (title, accounts) => {
  const sectionTotal = accounts.reduce((sum, acc) => sum + computeLeafTotal(acc), 0);

  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-right">Amount</th>
              <th className="py-2 px-4 border-b text-right">Total</th>
            </tr>
          </thead>
          <tbody>{renderAccountRows(accounts)}</tbody>
          <tfoot>
            <tr className="font-bold bg-gray-50 border-t border-gray-300">
              <td className="py-2 px-4">Total {title}</td>
              <td></td>
              <td align="right">{sectionTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default function BalanceSheet() {
  const { data, isLoading, isError, refetch } = useGetBalanceSheetQuery();

  if (isLoading) return <p>Loading Balance Sheet...</p>;
  if (isError) return <p>Error loading Balance Sheet</p>;

  const assets = data?.assets || [];
  const liabilities = data?.liabilities || [];
  const equity = data?.equity || [];

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
          <div className="mt-4">{renderSectionTable("Equity", equity)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
