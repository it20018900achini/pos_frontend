"use client";

import React, { useState, useMemo } from "react";
import {
  useCreateJournalMutation,
  useGetChartOfAccountsQuery,
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";

// Flatten nested accounts helper
const flattenAccounts = (accounts) => {
  let result = [];
  const traverse = (accList) => {
    accList.forEach((acc) => {
      result.push(acc);
      if (acc.children?.length) traverse(acc.children);
    });
  };
  traverse(accounts);
  return result;
};

export default function JournalForm() {
  
    const {userProfile, selectedBranchId } = useSelector((state) => state.user);
  const { toast } = useToast();
  const { data: accountsNested = [] } = useGetChartOfAccountsQuery(userProfile?.user?.store?.id);
  const accounts = useMemo(() => flattenAccounts(accountsNested), [accountsNested]);

  const [createJournal, { isLoading }] = useCreateJournalMutation();

  const [journal, setJournal] = useState({
    date: "",
    description: "",
    lines: [{ accountId: "", debit: 0, credit: 0 }],
  });

  // Add row
  const addRow = () => {
    setJournal((prev) => ({
      ...prev,
      lines: [...prev.lines, { accountId: "", debit: 0, credit: 0 }],
    }));
  };

  // Remove row
  const removeRow = (index) => {
    setJournal((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  // Update line
  const handleChange = (index, field, value) => {
    setJournal((prev) => {
      const lines = prev.lines.map((line, i) => {
        if (i !== index) return line;
        return { ...line, [field]: value };
      });
      return { ...prev, lines };
    });
  };

  // Compute totals
  const totals = useMemo(() => {
    return journal.lines.reduce(
      (acc, line) => {
        acc.debit += Number(line.debit || 0);
        acc.credit += Number(line.credit || 0);
        return acc;
      },
      { debit: 0, credit: 0 }
    );
  }, [journal.lines]);

  // Validation: check all fields and balance
  const isValid = useMemo(() => {
    if (!journal.date || !journal.description) return false;
    if (journal.lines.length === 0) return false;
    // All lines must have accountId and at least one of debit/credit > 0
    for (const l of journal.lines) {
      if (!l.accountId) return false;
      if (!l.debit && !l.credit) return false;
    }
    // Debit must equal Credit
    if (totals.debit !== totals.credit) return false;

    return true;
  }, [journal, totals]);

  // Submit
  const handleSubmit = async () => {
    if (!isValid) {
      toast({
        title: "Please fix errors. Journal must be balanced and all fields filled.",
      });
      return;
    }

    try {
      const payload = {
        entryDate: new Date(journal.date).toISOString(),
        description: journal.description,
        lines: journal.lines.map((l) => ({
          accountId:  Number(l.accountId) ,
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
        })),
      };

      await createJournal({branchId:selectedBranchId,...payload}).unwrap();

      toast({ title: "Journal entry saved!" });

      // Reset form
      setJournal({
        date: "",
        description: "",
        lines: [{ accountId: "", debit: 0, credit: 0 }],
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to save journal entry." });
    }
  };

  return (
    <Card className="space-y-4 p-3">
      {/* Header */}
         <CardHeader>
              <CardTitle className="text-xl font-bold">Journal Entry</CardTitle>
            </CardHeader>
                  <CardContent className="space-y-3 text-sm">
            
      <div className="flex gap-2">
        <Input
          type="date"
          value={journal.date}
          onChange={(e) => setJournal({ ...journal, date: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={journal.description}
          onChange={(e) => setJournal({ ...journal, description: e.target.value })}
        />
      </div>

      {/* Journal Lines Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Account</th>
            <th className="border border-gray-300 p-2">Debit</th>
            <th className="border border-gray-300 p-2">Credit</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {journal.lines.map((line, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-2">
                <Select
                  value={line.accountId}
                  onValueChange={(v) => handleChange(idx, "accountId", v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.code} - {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={line.debit}
                  onChange={(e) => handleChange(idx, "debit", parseFloat(e.target.value) || 0)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={line.credit}
                  onChange={(e) => handleChange(idx, "credit", parseFloat(e.target.value) || 0)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Button variant="destructive" onClick={() => removeRow(idx)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Actions & Totals */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <Button onClick={addRow}>Add Row</Button>
          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            {isLoading ? "Saving..." : "Save Journal"}
          </Button>
        </div>
        <div className="flex gap-4 font-bold">
          <span>Total Debit: {totals.debit.toFixed(2)}</span>
          <span>Total Credit: {totals.credit.toFixed(2)}</span>
        </div>
      </div></CardContent>
    </Card>
  );
}
