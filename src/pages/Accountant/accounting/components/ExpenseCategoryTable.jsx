import React, { useState } from 'react';
import ExpenseCategoryForm from './ExpenseCategoryForm';
import {
  useGetExpenseCategoriesQuery,
  useDeleteExpenseCategoryMutation,
} from "@/Redux Toolkit/features/expenseCategory/expenseCategoryApi";
export default function ExpenseCategoryTable() {
  const [editingCategory, setEditingCategory] = useState(null);
  const { data, isLoading } = useGetExpenseCategoriesQuery({ keyword: '', page: 0, size: 100 });
  const [deleteCategory] = useDeleteExpenseCategoryMutation();

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <div>
      <button
        onClick={() => setEditingCategory({})}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
      >
        Add Category
      </button>

      {editingCategory && (
        <ExpenseCategoryForm
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((cat) => (
            <tr key={cat.id}>
              <td className="border px-2 py-1">{cat.name}</td>
              <td className="border px-2 py-1">{cat.description}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => setEditingCategory(cat)}
                  className="bg-yellow-400 text-black px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
