// src/components/shift/EndShift.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentShift, endShift } from "../../../../Redux Toolkit/features/shift/shiftSlice";
import { Button } from "@/components/ui/button";
import {  Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const EndShift = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { currentShift, loading, error } = useSelector((state) => state.shift);
  const [actualCash, setActualCash] = useState("");

  useEffect(() => {
    dispatch(fetchCurrentShift());
  }, [dispatch]);

  const handleEndShift = async () => {
    if (!actualCash || isNaN(actualCash)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid cash amount",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(endShift({ actualCash: Number(actualCash) })).unwrap();
      toast({
        title: "Shift Ended",
        description: "Shift has been closed successfully",
        variant: "success",
      });
      setActualCash("");
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to end shift",
        variant: "destructive",
      });
    }
  };

  if (!currentShift) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">No active shift</h2>
        <p>Start a shift first to be able to close it.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">End Shift</h2>

      <div className="space-y-2">
        <p>
          <strong>Shift Start:</strong>{" "}
          {new Date(currentShift.shiftStart).toLocaleString()}
        </p>
        <p>
          <strong>Opening Cash:</strong> ${currentShift.openingCash}
        </p>
        <p>
          <strong>Expected Cash:</strong> ${currentShift.expectedCash}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Actual Cash</label>
        <Input
          type="number"
          value={actualCash}
          onChange={(e) => setActualCash(e.target.value)}
          placeholder="Enter actual cash"
          className="w-full py-2 px-3 rounded-lg border"
        />
      </div>

      <Button
        onClick={handleEndShift}
        disabled={loading}
        className="w-full py-3 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "End Shift"}
      </Button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {currentShift.cashDifference !== undefined && (
        <p className="mt-2">
          <strong>Cash Difference:</strong> ${currentShift.cashDifference}
        </p>
      )}
    </div>
  );
};

export default EndShift;
