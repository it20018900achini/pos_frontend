// src/pages/expenses/ExpenseCategoriesPage.jsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  useGetExpenseCategoriesQuery,
} from "@/Redux Toolkit/features/expenseCategory/expenseCategoryApi";
import { Button } from "@/components/ui/button";
import ExpenseCategoryForm from "../components/expenses/ExpenseCategoryForm";
import ExpenseCategoryTable from "../components/expenses/ExpenseCategoryTable";

const ExpenseCategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetExpenseCategoriesQuery({
    search,
    page,
    size: 10,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Expense Categories</h1>

      <ExpenseCategoryForm />

      <Input
        placeholder="Search category..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ExpenseCategoryTable data={data} />
      )}

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={data?.last}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ExpenseCategoriesPage;
