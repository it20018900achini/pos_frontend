"use client";

import React, { useState } from "react";
import { useCreateJournalMutation, useGetChartOfAccountsQuery } from
  "@/Redux Toolkit/features/accounting/accountingApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ExpenseForm() {
  const { data: accounts = [] } = useGetChartOfAccountsQuery();
  const [createJournal] = useCreateJournalMutation();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseAccount, setExpenseAccount] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("");

  const expenseAccounts = accounts.filter(
    (a) => a.type === "EXPENSE"
  );

  const paymentAccounts = accounts

  const saveExpense = async () => {
    if (!description || !amount || !expenseAccount || !paymentAccount) return;

    const payload = {
      description,
      lines: [
        {
          account: { id: expenseAccount },
          debit: amount,
          credit: 0,
        },
        {
          account: { id: paymentAccount },
          debit: 0,
          credit: amount,
        },
      ],
    };

    await createJournal(payload).unwrap();

    setDescription("");
    setAmount("");
    setExpenseAccount("");
    setPaymentAccount("");
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Create Expense</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Expense description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Expense Account */}
        <Select value={expenseAccount} onValueChange={setExpenseAccount}>
          <SelectTrigger>
            <SelectValue placeholder="Expense Account" />
          </SelectTrigger>
          <SelectContent>
            {expenseAccounts.map((acc) => (
              <SelectItem key={acc.id} value={String(acc.id)}>
                {acc.code} — {acc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Cash / Bank Account */}
        <Select value={paymentAccount} onValueChange={setPaymentAccount}>
          <SelectTrigger>
            <SelectValue placeholder="Paid From (Cash / Bank)" />
          </SelectTrigger>
          <SelectContent>
            {paymentAccounts.map((acc) => (
              <SelectItem key={acc.id} value={String(acc.id)}>
                {acc.code} — {acc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button className="w-full" onClick={saveExpense}>
          Save Expense
        </Button>
      </CardContent>
    </Card>
  );
}
