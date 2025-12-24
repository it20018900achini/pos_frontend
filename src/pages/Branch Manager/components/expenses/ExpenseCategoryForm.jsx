// src/components/expenses/ExpenseCategoryForm.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateExpenseCategoryMutation } from "@/Redux Toolkit/features/expenseCategory/expenseCategoryApi";

const ExpenseCategoryForm = () => {
  const [name, setName] = useState("");
  const [createCategory, { isLoading }] =
    useCreateExpenseCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createCategory({ name }).unwrap();
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        Add
      </Button>
    </form>
  );
};

export default ExpenseCategoryForm;
