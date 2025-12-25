"use client";

import React, { useState } from "react";
import { useGetJournalsQuery, useCreateJournalMutation } from "@/Redux Toolkit/features/accounting/accountingApi";
import { useGetChartOfAccountsQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JournalDashboard() {
  const { data: journals = [], refetch } = useGetJournalsQuery();
  const { data: accounts = [] } = useGetChartOfAccountsQuery();
  const [createJournal] = useCreateJournalMutation();

  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([{ accountId: "", debit: "", credit: "" }]);

  const handleLineChange = (index, field, value) => {
    const updated = [...lines];
    updated[index][field] = value;
    setLines(updated);
  };

  const addLine = () => setLines([...lines, { accountId: "", debit: "", credit: "" }]);
  const removeLine = (index) => {
    const updated = [...lines];
    updated.splice(index, 1);
    setLines(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      description,
      entryDate: new Date(),
      lines: lines.map((l) => ({
        account: { id: l.accountId },
        debit: parseFloat(l.debit || 0),
        credit: parseFloat(l.credit || 0),
      })),
    };
    await createJournal(payload).unwrap();
    setDescription("");
    setLines([{ accountId: "", debit: "", credit: "" }]);
    refetch();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Journal Dashboard</h2>

      {/* Add new journal */}
      <Input
        placeholder="Journal Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="space-y-2">
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <select
              value={line.accountId}
              onChange={(e) => handleLineChange(idx, "accountId", e.target.value)}
              className="border p-3 shadow rounded-md"
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.code} - {acc.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Debit"
              value={line.debit}
              onChange={(e) => handleLineChange(idx, "debit", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Credit"
              value={line.credit}
              onChange={(e) => handleLineChange(idx, "credit", e.target.value)}
            />
            <Button onClick={() => removeLine(idx)} variant="destructive">
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={addLine} variant="outline">
        Add Line
      </Button>
      <Button onClick={handleSubmit}>Submit Journal</Button>

      {/* Journal list */}
      {journals.map((j) => (
        <Card key={j.id}>
          <CardHeader>
            <CardTitle>{j.description}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {(j.lines || []).map((l, idx) => (
                <li key={idx}>
                  {l.account?.name || "N/A"} — Debit: {l.debit} | Credit: {l.credit}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
