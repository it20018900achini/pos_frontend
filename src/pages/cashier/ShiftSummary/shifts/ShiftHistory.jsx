// src/components/shifts/ShiftHistory.js
import React from 'react';
import { useGetAllShiftsQuery } from '../../../../Redux Toolkit/features/shift/shiftApi';

export default function ShiftHistory() {
  const { data, isLoading, isError } = useGetAllShiftsQuery();

  if (isLoading) return <p>Loading shifts...</p>;
  if (isError) return <p>Error loading shifts.</p>;

  return (
    <div>
      <h2>Shift History</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Start</th>
            <th>End</th>
            <th>Net Sales</th>
            <th>Cashier</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((shift) => (
            <tr key={shift.id}>
              <td>{shift.id}</td>
              <td>{new Date(shift.shiftStart).toLocaleString()}</td>
              <td>{shift.shiftEnd ? new Date(shift.shiftEnd).toLocaleString() : '-'}</td>
              <td>{shift.netSales}</td>
              <td>{shift.cashierId}</td>
              <td>{shift.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
