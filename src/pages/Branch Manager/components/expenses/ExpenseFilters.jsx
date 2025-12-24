import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ExpenseFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '' });

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form className="flex gap-2 mb-4" onSubmit={handleSubmit}>
      <Input name="search" placeholder="Search" value={filters.search} onChange={handleChange} />
      <Input name="startDate" type="datetime-local" value={filters.startDate} onChange={handleChange} />
      <Input name="endDate" type="datetime-local" value={filters.endDate} onChange={handleChange} />
      <Button type="submit">Filter</Button>
    </form>
  );
};

export default ExpenseFilters;
