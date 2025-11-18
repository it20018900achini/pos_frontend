import React from "react";

export default function CustomerPaymentTable({ payments, onEdit, onDelete, onSort }) {
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort("createdAt", "asc")}>Date</th>
          <th>Amount</th>
          <th>Customer</th>
          <th>Cashier</th>
          <th>Method</th>
          <th>Reference</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id}>
            <td>{new Date(p.createdAt).toLocaleString()}</td>
            <td>{p.amount}</td>
            <td>{p.customerId}</td>
            <td>{p.cashierId}</td>
            <td>{p.paymentMethod}</td>
            <td>{p.reference}</td>
            <td>
              <button onClick={() => onEdit(p)}>Edit</button>
              <button onClick={() => onDelete(p.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
