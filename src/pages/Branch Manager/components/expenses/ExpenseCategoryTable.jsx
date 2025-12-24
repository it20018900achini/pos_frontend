// src/components/expenses/ExpenseCategoryTable.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  useDeleteExpenseCategoryMutation,
} from "@/Redux Toolkit/features/expenseCategory/expenseCategoryApi";

const ExpenseCategoryTable = ({ data }) => {
  const [deleteCategory] = useDeleteExpenseCategoryMutation();

  return (
    <div className="border rounded-lg mt-4">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.content?.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="p-3">{cat.name}</td>
              <td className="p-3 text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCategory(cat.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {!data?.content?.length && (
            <tr>
              <td colSpan="2" className="p-4 text-center text-muted-foreground">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseCategoryTable;
