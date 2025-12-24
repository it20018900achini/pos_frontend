import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateExpenseMutation } from "../../../../Redux Toolkit/features/expenses/expenseApi";
import { useGetExpenseCategoriesQuery } from "../../../../Redux Toolkit/features/expenseCategory/expenseCategoryApi";

const ExpenseForm = ({ branches, onCreated }) => {
  const [createExpense] = useCreateExpenseMutation();

  // ✅ Fetch categories from backend
  const { data: categoryPage, isLoading: categoryLoading } =
    useGetExpenseCategoriesQuery({ page: 0, size: 100 });

  const categories = categoryPage?.content || [];

  const [form, setForm] = useState({
    title: "",
    amount: "",
    description: "",
    branchId: "",
    categoryId: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createExpense({
      ...form,
      amount: parseFloat(form.amount),
      branchId: Number(form.branchId),
      categoryId: Number(form.categoryId),
    }).unwrap();

    onCreated?.();

    setForm({
      title: "",
      amount: "",
      description: "",
      branchId: "",
      categoryId: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        placeholder="Title"
        value={form.title}
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
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      {/* Branch Select */}
      <Select
        value={form.branchId}
        onValueChange={(value) =>
          setForm({ ...form, branchId: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.id} value={String(b.id)}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Select */}
      <Select
        value={form.categoryId}
        onValueChange={(value) =>
          setForm({ ...form, categoryId: value })
        }
        disabled={categoryLoading}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              categoryLoading ? "Loading categories..." : "Select Category"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit">Add Expense</Button>
    </form>
  );
};

export default ExpenseForm;
