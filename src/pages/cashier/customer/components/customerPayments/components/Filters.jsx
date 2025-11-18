import React, { useState } from "react";

export default function Filters({ onFilter }) {
  const [data, setData] = useState({
    customerId: "",
    cashierId: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {};
    if (data.customerId) filters.customerId = data.customerId;
    if (data.cashierId) filters.cashierId = data.cashierId;
    if (data.paymentMethod) filters.paymentMethod = data.paymentMethod;
    if (data.startDate) filters.startDate = data.startDate + ":00";
    if (data.endDate) filters.endDate = data.endDate + ":00";
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Customer ID"
        value={data.customerId}
        onChange={(e) => setData({ ...data, customerId: e.target.value })}
      />
      <input
        type="number"
        placeholder="Cashier ID"
        value={data.cashierId}
        onChange={(e) => setData({ ...data, cashierId: e.target.value })}
      />
      <select
        value={data.paymentMethod}
        onChange={(e) => setData({ ...data, paymentMethod: e.target.value })}
      >
        <option value="">All</option>
        <option value="CASH">Cash</option>
        <option value="CARD">Card</option>
        <option value="ONLINE">Online</option>
      </select>
      <input
        type="datetime-local"
        onChange={(e) => setData({ ...data, startDate: e.target.value })}
      />
      <input
        type="datetime-local"
        onChange={(e) => setData({ ...data, endDate: e.target.value })}
      />
      <button type="submit">Filter</button>
    </form>
  );
}
