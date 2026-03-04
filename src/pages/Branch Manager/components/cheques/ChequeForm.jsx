import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateChequeMutation } from "@/Redux Toolkit/features/cheque/chequeApi";
import { useSelector } from "react-redux";

const ChequeForm = ({ onCreated }) => {
  const [createCheque] = useCreateChequeMutation();
      const { selectedBranchId } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    chequeNumber: "",
    bankName: "",
    payee: "",
    amount: "",
    issueDate: "",
    type: "RECEIVED",
    branchId: selectedBranchId, // ✅ Use selectedBranchId from Redux state
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCheque({ ...form, amount: parseFloat(form.amount) });
    onCreated?.();
    setForm({
      chequeNumber: "",
      bankName: "",
      payee: "",
      amount: "",
      issueDate: "",
      type: "RECEIVED",
      branchId: selectedBranchId, // reset
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <Input
        name="chequeNumber"
        placeholder="Cheque Number"
        value={form.chequeNumber}
        onChange={handleChange}
      />
      <Input
        name="bankName"
        placeholder="Bank Name"
        value={form.bankName}
        onChange={handleChange}
      />
      <Input
        name="payee"
        placeholder="Payee"
        value={form.payee}
        onChange={handleChange}
      />
      <Input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
      />
      <Input
        name="issueDate"
        type="datetime-local"
        placeholder="Issue Date"
        value={form.issueDate}
        onChange={handleChange}
      />

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="RECEIVED">Received</option>
        <option value="PAID">Paid</option>
      </select>

      <Button type="submit">Add Cheque</Button>
    </form>
  );
};

export default ChequeForm;
