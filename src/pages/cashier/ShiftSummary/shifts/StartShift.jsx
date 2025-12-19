// src/components/shifts/StartShift.js
import React, { useState } from 'react';
import { useStartShiftMutation } from '../../../../Redux Toolkit/features/shift/shiftApi';

export default function StartShift({ branchId }) {
  const [openingCash, setOpeningCash] = useState('');
  const [startShift, { isLoading }] = useStartShiftMutation();

  const handleStartShift = async () => {
    try {
      const shift = await startShift({ branchId, openingCash: parseFloat(openingCash) }).unwrap();
      alert('Shift started successfully!');
      console.log(shift);
    } catch (err) {
      alert(err.data || 'Error starting shift');
    }
  };

  return (
    <div>
      <h2>Start Shift</h2>
      <input
        type="number"
        placeholder="Opening Cash"
        value={openingCash}
        onChange={(e) => setOpeningCash(e.target.value)}
      />
      <button onClick={handleStartShift} disabled={isLoading}>
        {isLoading ? 'Starting...' : 'Start Shift'}
      </button>
    </div>
  );
}
