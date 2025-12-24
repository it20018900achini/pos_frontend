import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import { useGetExpensesQuery } from '../../../Redux Toolkit/features/expenses/expenseApi';

const ExpensesPage = () => {
  const [filters, setFilters] = useState({});
  const { data, refetch } = useGetExpensesQuery(
    { ...filters, page: 0, size: 10 },
    { skip: false }
  );

  // ✅ Only refetch when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const branches = [{ id: '52', name: 'Branch 52' }, { id: '2', name: 'Branch 2' }];
  const categories = [{ id: '1', name: 'Food' }, { id: '2', name: 'Utilities' }];

  return (
    <div className="p-4 space-y-6">
      <ExpenseForm branches={branches} categories={categories} onCreated={refetch} />
      <ExpenseFilters onFilter={(newFilters) => setFilters(newFilters)} />
      <ExpenseTable data={data?.content || []} />
    </div>
  );
};

export default ExpensesPage;
