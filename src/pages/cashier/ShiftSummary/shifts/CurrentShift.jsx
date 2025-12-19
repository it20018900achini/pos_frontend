// src/components/shifts/CurrentShift.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { endShift, fetchCurrentShift } from "../../../../Redux Toolkit/features/shift/shiftSlice";

const CurrentShift = () => {
  const dispatch = useDispatch();
  const { currentShift } = useSelector((state) => state.shift);

  const handleEndShift = () => {
    const cash = prompt("Enter actual cash at end of shift:");
    if (cash) {
      dispatch(endShift({ actualCash: parseFloat(cash) }))
        .unwrap()
        .then(() => dispatch(fetchCurrentShift()));
    }
  };

  if (!currentShift) return <p>No open shift</p>;

  return (
    <div className="mb-4 p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-bold">Current Shift</h2>
      <p>
        <strong>Start:</strong> {new Date(currentShift.shiftStart).toLocaleString()}
      </p>
      <p>
        <strong>Expected Cash:</strong> {currentShift.expectedCash}
      </p>
      <button
        onClick={handleEndShift}
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
      >
        End Shift
      </button>
    </div>
  );
};

export default CurrentShift;
