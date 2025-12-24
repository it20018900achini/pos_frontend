import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';

const ExpenseTable = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Branch</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{expense.title}</TableCell>
            <TableCell>{expense.amount}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{expense.branchName}</TableCell>
            <TableCell>{expense.categoryName}</TableCell>
            <TableCell>{new Date(expense.date).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpenseTable;
