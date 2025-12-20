import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  endShift,
  fetchCurrentShift,
} from "../../../../Redux Toolkit/features/shift/shiftSlice";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CurrentShift = () => {
  const dispatch = useDispatch();
  const { currentShift, loading } = useSelector((state) => state.shift);

  // ✅ FETCH CURRENT SHIFT ON LOAD
  useEffect(() => {
    dispatch(fetchCurrentShift());
  }, [dispatch]);

  const handleEndShift = async () => {
    const cash = prompt("Enter actual cash at end of shift:");
    if (!cash || isNaN(cash)) return;

    await dispatch(endShift({ actualCash: Number(cash) })).unwrap();
    dispatch(fetchCurrentShift()); // refresh
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="p-4 flex items-center gap-2">
        <Loader2 className="animate-spin" />
        Loading current shift...
      </div>
    );
  }

  // ✅ No shift state
  if (!currentShift) {
    return (
      <div className="p-4 border rounded text-muted-foreground">
        No open shift
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 ">
      <h2 className="text-xl font-bold mb-2">Current Shift</h2>

      <p>
        <strong>Start:</strong>{" "}
        {new Date(currentShift.shiftStart).toLocaleString()}
      </p>

      <p>
        <strong>Opening Cash:</strong> {currentShift.openingCash}
      </p>

      <p>
        <strong>Expected Cash:</strong> {currentShift.expectedCash}
      </p>

      
    </div>
  );
};

export default CurrentShift;
