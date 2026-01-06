import React, { useState, useEffect } from 'react';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '../../../../Redux Toolkit/features/accounting/accountingApi';

export default function ExpenseForm({ expense, onClose, categories, branchId = 52 }) {
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [expenseType, setExpenseType] = useState('REGULAR');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();

  useEffect(() => {
    if (expense) {
      setTitle(expense.title || '');
      setTotalAmount(expense.totalAmount || '');
      setExpenseType(expense.expenseType || 'REGULAR');
      setStartDate(expense.startDate ? expense.startDate.slice(0, 10) : '');
      setEndDate(expense.endDate ? expense.endDate.slice(0, 10) : '');
      setCategoryId(expense.categoryId || '');
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      totalAmount: Number(totalAmount),
      expenseType,
      startDate,
      endDate,
      branchId,
      categoryId: Number(categoryId),
    };

    if (expense?.id) {
      await updateExpense({ id: expense.id, ...payload });
    } else {
      await createExpense(payload);
    }

    onClose();
  };

  return (
    <div className="p-4 border mb-4 bg-gray-50">
      <h3>{expense?.id ? 'Edit' : 'Add'} Expense</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Total Amount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <select
          value={expenseType}
          onChange={(e) => setExpenseType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="REGULAR">Regular</option>
          <option value="PREPAID">Prepaid</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-black px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
