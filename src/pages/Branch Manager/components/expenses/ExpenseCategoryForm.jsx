"use client";
import React, { useState, useEffect, useMemo } from "react";

import {
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
} from "../../../../Redux Toolkit/features/expenseCategory/expenseCategoryApi";

import {
  useGetChartOfAccountsQuery,
} from "@/Redux Toolkit/features/accounting/accountingApi";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ExpenseCategoryForm({ category, onClose }) {
  const [name, setName] = useState("");
  const [accountCode, setAccountCode] = useState("");

  const { data: accounts = [], isLoading } = useGetChartOfAccountsQuery();

  const [createCategory] = useCreateExpenseCategoryMutation();
  const [updateCategory] = useUpdateExpenseCategoryMutation();

  /* ✅ Only EXPENSE accounts */
  const expenseAccounts = useMemo(
    () => accounts.filter((a) => a.type === "EXPENSE"),
    [accounts]
  );

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setAccountCode(String(category.accountCode || ""));
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      accountCode: Number(accountCode),
    };

    if (category?.id) {
      await updateCategory({ id: category.id, ...payload });
    } else {
      await createCategory(payload);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Category Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="border p-2 rounded w-full"
        required
      />

      {/* Expense Account Select */}
      <Select
        value={accountCode}
        onValueChange={setAccountCode}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Expense Account" />
        </SelectTrigger>

        <SelectContent>
          {expenseAccounts.map((acc) => (
            <SelectItem key={acc.id} value={String(acc.code)}>
              {acc.code} — {acc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {category?.id ? "Update" : "Create"}
      </button>
    </form>
  );
}
