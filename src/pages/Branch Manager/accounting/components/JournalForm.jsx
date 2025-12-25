"use client";
import React, { useState } from "react";
import { useCreateJournalMutation, useGetChartOfAccountsQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function JournalForm() {
  const { data: accounts = [] } = useGetChartOfAccountsQuery();
  const [createJournal, { isLoading }] = useCreateJournalMutation();

  const [journal, setJournal] = useState({
    date: "",
    description: "",
    entries: [{ accountCode: "", debit: 0, credit: 0 }],
  });

  const addRow = () => {
    setJournal({ ...journal, entries: [...journal.entries, { accountCode: "", debit: 0, credit: 0 }] });
  };

  const removeRow = (index) => {
    const entries = journal.entries.filter((_, i) => i !== index);
    setJournal({ ...journal, entries });
  };

  const handleChange = (index, field, value) => {
    const entries = journal.entries.map((e, i) => i === index ? { ...e, [field]: value } : e);
    setJournal({ ...journal, entries });
  };

  const handleSubmit = async () => {
    try {
      await createJournal(journal).unwrap();
      alert("Journal entry saved!");
      setJournal({ date: "", description: "", entries: [{ accountCode: "", debit: 0, credit: 0 }] });
    } catch (err) {
      console.error(err);
      alert("Failed to save journal entry");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input type="date" value={journal.date} onChange={e => setJournal({ ...journal, date: e.target.value })} />
        <Input placeholder="Description" value={journal.description} onChange={e => setJournal({ ...journal, description: e.target.value })} />
      </div>

      <div className="space-y-2">
        {journal.entries.map((entry, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Select value={entry.accountCode} onValueChange={v => handleChange(idx, "accountCode", v)}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Account" /></SelectTrigger>
              <SelectContent>
                {accounts.map(acc => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Debit" value={entry.debit} onChange={e => handleChange(idx, "debit", parseFloat(e.target.value))} />
            <Input type="number" placeholder="Credit" value={entry.credit} onChange={e => handleChange(idx, "credit", parseFloat(e.target.value))} />
            <Button variant="destructive" onClick={() => removeRow(idx)}>Remove</Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={addRow}>Add Row</Button>
        <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Saving..." : "Save Journal"}</Button>
      </div>
    </div>
  );
}
