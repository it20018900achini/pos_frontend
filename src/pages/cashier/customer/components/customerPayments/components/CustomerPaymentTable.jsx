import React from "react";
import { Button } from "@/components/ui/button";

export default function CustomerPaymentTable({ payments, onEdit, onDelete, onSort, sortBy, sortDir }) {
  if (!payments || payments.length === 0) {
    return <p className="text-center py-4">No payments found.</p>;
  }

  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => onSort("createdAt", sortBy === "createdAt" && sortDir === "asc" ? "desc" : "asc")}
            >
              Date{renderSortIndicator("createdAt")}
            </th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Cashier</th>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">Reference</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">{p.amount}</td>
              <td className="px-4 py-2">{p.cashier?.fullName || p.cashierId}</td>
              <td className="px-4 py-2">{p.paymentMethod}</td>
              <td className="px-4 py-2">{p.reference}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(p)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
