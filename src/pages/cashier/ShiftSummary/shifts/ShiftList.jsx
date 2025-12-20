// src/components/shifts/ShiftList.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShifts, fetchShiftById } from "../../../../Redux Toolkit/features/shift/shiftSlice";

const ShiftList = ({ onSelect }) => {
  const dispatch = useDispatch();
  const { shifts, loading, error } = useSelector((state) => state.shift);

  useEffect(() => {
    dispatch(fetchShifts());
  }, [dispatch]);

  if (loading) return <p>Loading shifts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!Array.isArray(shifts) || shifts.length === 0) return <p>No shifts found</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">All Shifts</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>Cashier</th> */}
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id} className="text-center border-t border-gray-200">
              <td>{shift.id}</td>
              {/* <td>{JSON.stringify(shift)}</td> */}
              <td>{new Date(shift.shiftStart).toLocaleString()}</td>
              <td>{shift.shiftEnd ? new Date(shift.shiftEnd).toLocaleString() : "-"}</td>
              <td>{shift.status}</td>
              <td>
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => onSelect(shift.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftList;
