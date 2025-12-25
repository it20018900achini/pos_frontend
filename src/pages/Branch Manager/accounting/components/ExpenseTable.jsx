import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import { useGetExpensesQuery } from '../../../../Redux Toolkit/features/expenses/expenseApi';
import { useDeleteExpenseMutation } from '../../../../Redux Toolkit/features/accounting/accountingApi';
import { useGetExpenseCategoriesQuery } from '../../../../Redux Toolkit/features/expenseCategory/expenseCategoryApi';
export default function ExpenseTable() {
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const { data: categories } = useGetExpenseCategoriesQuery({ keyword: '', page: 0, size: 100 });
  const { data: expenses, isLoading } = useGetExpensesQuery({
    categoryId: filterCategory || undefined,
    from: filterFrom || undefined,
    to: filterTo || undefined,
  });
  const [deleteExpense] = useDeleteExpenseMutation();

  if (isLoading) return <p>Loading expenses...</p>;

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2">
          <option value="">All Categories</option>
          {categories?.content.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="border p-2" />
        <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="border p-2" />
        <button onClick={() => setEditingExpense({})} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Expense
        </button>
      </div>

      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          categories={categories?.content || []}
        />
      )}

      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses?.map((exp) => (
            <tr key={exp.id}>
              <td className="border px-2 py-1">{exp.title}</td>
              <td className="border px-2 py-1">{exp.amount}</td>
              <td className="border px-2 py-1">{new Date(exp.date).toLocaleDateString()}</td>
              <td className="border px-2 py-1">{exp.category?.name}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => setEditingExpense(exp)}
                  className="bg-yellow-400 text-black px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExpense(exp.id)}
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
