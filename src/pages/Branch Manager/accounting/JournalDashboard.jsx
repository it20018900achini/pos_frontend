"use client";

import React, { useState } from "react";
import {
  useGetJournalsQuery,
  useCreateJournalMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { useGetChartOfAccountsQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, RefreshCw } from "lucide-react";

export default function JournalDashboard() {
  const { data: journals = [], isLoading, refetch } =
    useGetJournalsQuery();

  const { data: accounts = [] } =
    useGetChartOfAccountsQuery();

  const [createJournal] = useCreateJournalMutation();

  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([]);
  const [filterAccount, setFilterAccount] = useState("");

  /* ➕ Add new journal line */
  const addLine = () => {
    setLines([
      ...lines,
      { accountId: "", debit: "", credit: "" },
    ]);
  };

  /* 🗑 Remove line */
  const removeLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  /* ✏️ Update line */
  const updateLine = (index, field, value) => {
    const updated = [...lines];
    updated[index][field] = value;
    setLines(updated);
  };

  /* 💾 Save Journal */
  const saveJournal = async () => {
    if (!description || lines.length === 0) return;

    await createJournal({
      description,
      lines: lines.map((l) => ({
        account: { id: l.accountId },
        debit: l.debit || 0,
        credit: l.credit || 0,
      })),
    }).unwrap();

    setDescription("");
    setLines([]);
    refetch();
  };

  /* 🔍 Filter journals by account */
  const filteredJournals = filterAccount
    ? journals.filter((j) =>
        j.lines?.some(
          (l) => l.account?.id === Number(filterAccount)
        )
      )
    : journals;

  if (isLoading) return <p>Loading journals...</p>;

  return (
    <div className="space-y-6">

      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Journal Dashboard</h2>
        <Button variant="outline" onClick={refetch}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* 🔹 Create Journal */}
      <Card>
        <CardHeader>
          <CardTitle>Create Journal Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <Input
            placeholder="Journal description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Lines */}
          {lines.map((line, index) => (
            <div
              key={index}
              className="flex gap-2 items-center"
            >
              <Select
                value={line.accountId}
                onValueChange={(v) =>
                  updateLine(index, "accountId", v)
                }
              >
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem
                      key={acc.id}
                      value={String(acc.id)}
                    >
                      {acc.code} — {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Debit"
                value={line.debit}
                onChange={(e) =>
                  updateLine(index, "debit", e.target.value)
                }
              />

              <Input
                type="number"
                placeholder="Credit"
                value={line.credit}
                onChange={(e) =>
                  updateLine(index, "credit", e.target.value)
                }
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLine(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Button variant="outline" onClick={addLine}>
              <Plus className="w-4 h-4 mr-1" />
              Add Line
            </Button>
            <Button onClick={saveJournal}>Save Journal</Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Filter */}
      <div className="flex gap-2 items-center">
        <Select value={filterAccount} onValueChange={setFilterAccount}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by Account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={String(acc.id)}>
                {acc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filterAccount && (
          <Button variant="ghost" onClick={() => setFilterAccount("")}>
            Clear
          </Button>
        )}
      </div>

      {/* 🔹 Journal List */}
      {filteredJournals.length === 0 ? (
        <p className="text-muted-foreground">No journals found</p>
      ) : (
        filteredJournals.map((j) => (
          <Card key={j.id}>
            <CardHeader>
              <CardTitle>{j.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {(j.lines || []).map((l, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between"
                  >
                    <span>
                      {l.account?.name ?? "N/A"}
                    </span>
                    <Badge variant="outline">
                      D: {l.debit || 0} | C: {l.credit || 0}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
