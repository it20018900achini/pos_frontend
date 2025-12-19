// src/components/shifts/StartShiftForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startShift, fetchShifts } from "../../../../Redux Toolkit/features/shift/shiftSlice";

const StartShiftForm = () => {
  const dispatch = useDispatch();
  const [branchId, setBranchId] = useState("");
  const [openingCash, setOpeningCash] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(startShift({ branchId: parseInt(branchId), openingCash: parseFloat(openingCash) }))
      .unwrap()
      .then(() => dispatch(fetchShifts()));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-bold mb-2">Start New Shift</h2>
      <div className="mb-2">
        <label className="mr-2">Branch ID:</label>
        <input
          type="number"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="border p-1"
        />
      </div>
      <div className="mb-2">
        <label className="mr-2">Opening Cash:</label>
        <input
          type="number"
          value={openingCash}
          onChange={(e) => setOpeningCash(e.target.value)}
          className="border p-1"
        />
      </div>
      <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded">Start Shift</button>
    </form>
  );
};

export default StartShiftForm;
