// src/components/shifts/ShiftDetails.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShiftById, clearSelectedShift } from "../../../../Redux Toolkit/features/shift/shiftSlice";

const ShiftDetails = ({ shiftId }) => {
  const dispatch = useDispatch();
  const { selectedShift, loading, error } = useSelector((state) => state.shift);

  useEffect(() => {
    if (shiftId) dispatch(fetchShiftById(shiftId));
    return () => dispatch(clearSelectedShift());
  }, [dispatch, shiftId]);

  if (!shiftId) return <p>Select a shift to see details</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedShift) return null;

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-bold mb-2">Shift Details (ID: {selectedShift.id})</h2>
      <p><strong>Cashier:</strong> {selectedShift.cashier?.fullName}</p>
      <p><strong>Status:</strong> {selectedShift.status}</p>
      <p><strong>Opening Cash:</strong> {selectedShift.openingCash}</p>
      <p><strong>Expected Cash:</strong> {selectedShift.expectedCash}</p>
      <p><strong>Actual Cash:</strong> {selectedShift.actualCash || "-"}</p>
      <p><strong>Cash Difference:</strong> {selectedShift.cashDifference || "-"}</p>
      <p><strong>Total Sales:</strong> {selectedShift.totalSales}</p>
      <p><strong>Total Orders:</strong> {selectedShift.totalOrders}</p>

      <h3 className="mt-2 font-semibold">Top Products:</h3>
      <ul>
        {selectedShift.topProducts?.map((p) => (
          <li key={p.productId}>{p.productName} - {p.totalQuantity}</li>
        ))}
      </ul>

      <h3 className="mt-2 font-semibold">Payment Summary:</h3>
      <ul>
        {selectedShift.paymentSummaries?.map((p, idx) => (
          <li key={idx}>{p.type}: {p.totalAmount} ({p.transactionCount} transactions)</li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftDetails;
