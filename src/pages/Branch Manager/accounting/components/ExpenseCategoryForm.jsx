import React, { useState, useEffect } from "react";
import { useCreateExpenseCategoryMutation, useUpdateExpenseCategoryMutation } from "../../../../Redux Toolkit/features/expenseCategory/expenseCategoryApi";
// import {
//   useCreateExpenseCategoryMutation,
//   useUpdateExpenseCategoryMutation,
// } from "@/Redux Toolkit/features/accounting/accountingApi";

export default function ExpenseCategoryForm({ category, onClose }) {
  const [name, setName] = useState("");

  const [createCategory] = useCreateExpenseCategoryMutation();
  const [updateCategory] = useUpdateExpenseCategoryMutation();

  useEffect(() => {
    if (category) setName(category.name || "");
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category?.id) await updateCategory({ id: category.id, name });
    else await createCategory({ name });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="border p-2 rounded mb-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {category?.id ? "Update" : "Create"}
      </button>
    </form>
  );
}
