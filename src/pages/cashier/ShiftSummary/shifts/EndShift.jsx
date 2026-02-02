"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentShift } from "../../../../Redux Toolkit/features/shift/shiftSlice";
import { useEndShiftMutation } from "../../../../Redux Toolkit/features/shift/shiftApi";

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

const COINS = ["1", "5", "10", "50", "100", "500"];

const EndShift = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [endShift, { isLoading }] = useEndShiftMutation();
  const { currentShift, loading } = useSelector((state) => state.shift);

  // ✅ Closing coins state
  const [closingCoins, setClosingCoins] = useState({
    "1": 0,
    "5": 0,
    "10": 0,
    "50": 0,
    "100": 0,
    "500": 0,
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchCurrentShift());
    }
  }, [dispatch, open]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // ✅ Calculate actual cash from coins
  const actualCash = useMemo(() => {
    return Object.entries(closingCoins).reduce(
      (sum, [coin, count]) => sum + Number(coin) * Number(count),
      0
    );
  }, [closingCoins]);

  const handleCoinChange = (coin, value) => {
    setClosingCoins((prev) => ({
      ...prev,
      [coin]: Number(value) || 0,
    }));
  };

  const handleEndShift = async () => {
    try {
      await endShift({
        actualCash,
        closingCoins,
      }).unwrap();

      toast({
        title: "Shift Ended",
        description: "Shift closed successfully",
      });

      setClosingCoins({
        "1": 0,
        "5": 0,
        "10": 0,
        "50": 0,
        "100": 0,
        "500": 0,
      });

      onClose();

      handleLogout();

          window.location.reload();

    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to end shift",
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>End Shift</DialogTitle>
        </DialogHeader>

        {/* Shift summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Shift Start</span>
            <span>
              {new Date(currentShift.shiftStart).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Opening Cash</span>
            <span>LKR {currentShift.openingCash}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Expected Cash</span>
            <span>LKR {currentShift.expectedCash}</span>
          </div>
        </div>

        {/* ✅ Closing coins */}
        <div className="pt-4 space-y-3">
          <Label className="text-sm font-semibold">
            Closing Coins
          </Label>

          <div className="grid grid-cols-2 gap-3">
            {COINS.map((coin) => (
              <div key={coin} className="space-y-1">
                <Label className="text-xs">LKR {coin}</Label>
                <Input
                  type="number"
                  min="0"
                  value={closingCoins[coin]}
                  onChange={(e) =>
                    handleCoinChange(coin, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actual cash */}
        <div className="pt-3 text-sm font-medium">
          Actual Cash: LKR {actualCash}
        </div>

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading || isLoading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleEndShift}
            disabled={loading || isLoading}
            className="flex items-center gap-2"
          >
            {(loading || isLoading) && (
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
