import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentShift,
  endShift,
} from "../../../../Redux Toolkit/features/shift/shiftSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { logout } from "../../../../Redux Toolkit/features/user/userThunks";
import { useNavigate } from "react-router";

const EndShift = ({ open, onClose }) => {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const { toast } = useToast();

  const { currentShift, loading } = useSelector((state) => state.shift);
  const [actualCash, setActualCash] = useState("");

  useEffect(() => {
    if (open) {
      dispatch(fetchCurrentShift());
    }
  }, [dispatch, open]);

    const handleLogout = () => {
      dispatch(logout());
      navigate("/");
    };
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
      await dispatch(
        endShift({ actualCash: Number(actualCash) })
        
      ).unwrap();
handleLogout()
      toast({
        title: "Shift Ended",
        description: "Shift closed successfully",
      });

      setActualCash("");
      onClose();
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
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Active Shift</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            There is no active shift to close.
          </p>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>End Shift</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Shift Start</span>
            <span>
              {new Date(currentShift.shiftStart).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Opening Cash</span>
            <span>${currentShift.openingCash}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Expected Cash</span>
            <span>${currentShift.expectedCash}</span>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <Label>Actual Cash</Label>
          <Input
            type="number"
            value={actualCash}
            onChange={(e) => setActualCash(e.target.value)}
            placeholder="Enter actual cash"
          />
        </div>

        {currentShift.cashDifference !== undefined && (
          <p className="text-sm">
            <strong>Cash Difference:</strong>{" "}
            ${currentShift.cashDifference}
          </p>
        )}

        <DialogFooter className="pt-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleEndShift}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            End Shift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EndShift;
