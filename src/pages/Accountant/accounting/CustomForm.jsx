"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomForm() {
  // 1. State Structure (Header + Array of Objects for Lines)
  const [journal, setJournal] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    reference: "",
    notes: "",
    lines: [
      { accountId: "", description: "", debit: 0, credit: 0 },
      { accountId: "", description: "", debit: 0, credit: 0 },
    ],
  });

  // 2. Logic to calculate totals from the array of objects
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

  const isBalanced = totals.debit > 0 && totals.debit === totals.credit;

  // 3. Handlers for Array Manipulation
  const handleLineChange = (index, field, value) => {
    const newLines = [...journal.lines];
    newLines[index][field] = value;

    // Standard Accounting UX: If debit is entered, clear credit and vice versa
    if (field === "debit" && value > 0) newLines[index].credit = 0;
    if (field === "credit" && value > 0) newLines[index].debit = 0;

    setJournal({ ...journal, lines: newLines });
  };

  const addLine = () => {
    setJournal({
      ...journal,
      lines: [...journal.lines, { accountId: "", description: "", debit: 0, credit: 0 }],
    });
  };

  const removeLine = (index) => {
    if (journal.lines.length <= 2) return; // Keep minimum 2 lines
    setJournal({
      ...journal,
      lines: journal.lines.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    console.log("Submitting Journal Entity:", journal);
    // Call your RTK Mutation here
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">New Journal Entry</CardTitle>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2",
            isBalanced ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          )}>
            {isBalanced ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {isBalanced ? "Balanced" : `Unbalanced: ${(totals.debit - totals.credit).toFixed(2)}`}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* --- HEADER SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Date</label>
              <Input 
                type="date" 
                value={journal.entryDate} 
                onChange={(e) => setJournal({...journal, entryDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Reference #</label>
              <Input 
                placeholder="JE-1001" 
                value={journal.reference} 
                onChange={(e) => setJournal({...journal, reference: e.target.value})}
              />
            </div>
          </div>

          {/* --- LINES SECTION (Array of Objects) --- */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left">Account</th>
                  <th className="p-3 text-right w-32">Debit</th>
                  <th className="p-3 text-right w-32">Credit</th>
                  <th className="p-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {journal.lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-2">
                      <Select 
                        value={line.accountId} 
                        onValueChange={(v) => handleLineChange(idx, 'accountId', v)}
                      >
                        <SelectTrigger className="border-none shadow-none focus:ring-0">
                          <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1001 - Cash</SelectItem>
                          <SelectItem value="2">4001 - Revenue</SelectItem>
                          <SelectItem value="3">5001 - Rent Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number" 
                        className="text-right border-none shadow-none focus-visible:ring-1" 
                        value={line.debit || ""}
                        onChange={(e) => handleLineChange(idx, 'debit', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number" 
                        className="text-right border-none shadow-none focus-visible:ring-1" 
                        value={line.credit || ""}
                        onChange={(e) => handleLineChange(idx, 'credit', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500" 
                        onClick={() => removeLine(idx)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 bg-gray-50/50 border-t">
              <Button variant="outline" size="sm" onClick={addLine} className="text-xs">
                <Plus size={14} className="mr-1" /> Add Line
              </Button>
            </div>
          </div>

          {/* --- FOOTER TOTALS --- */}
          <div className="flex flex-col items-end gap-2 pr-12">
            <div className="flex justify-between w-64 text-sm">
              <span className="text-gray-500 font-medium">Total Debit:</span>
              <span className="font-bold">{totals.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between w-64 text-sm border-b pb-2">
              <span className="text-gray-500 font-medium">Total Credit:</span>
              <span className="font-bold">{totals.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            disabled={!isBalanced || !journal.reference}
            onClick={handleSubmit}
          >
            <Save size={16} className="mr-2" /> Post Journal Entry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}