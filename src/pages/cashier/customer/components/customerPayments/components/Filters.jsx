import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
      <Input
        type="number"
        placeholder="Customer ID"
        value={data.customerId}
        onChange={(e) => setData({ ...data, customerId: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Cashier ID"
        value={data.cashierId}
        onChange={(e) => setData({ ...data, cashierId: e.target.value })}
      />

      <Select
        value={data.paymentMethod}
        onValueChange={(value) => setData({ ...data, paymentMethod: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="CASH">Cash</SelectItem>
          <SelectItem value="CARD">Card</SelectItem>
          <SelectItem value="ONLINE">Online</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="datetime-local"
        onChange={(e) => setData({ ...data, startDate: e.target.value })}
      />
      <Input
        type="datetime-local"
        onChange={(e) => setData({ ...data, endDate: e.target.value })}
      />

      <Button type="submit" className="col-span-full md:col-span-1">
        Filter
      </Button>
    </form>
  );
}
