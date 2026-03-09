import { useState, useEffect } from "react";
import { useStartShiftMutation } from "@/Redux Toolkit/features/shift/shiftApi";

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

const COINS = ["1", "5", "10", "50", "100", "500"];

export default function StartShiftForm({ open, onClose, branchId }) {

  const [openingCash, setOpeningCash] = useState("");

  const [openingCoins, setOpeningCoins] = useState({
    "1": 0,
    "5": 0,
    "10": 0,
    "50": 0,
    "100": 0,
    "500": 0,
  });

  const [startShift, { isLoading, error }] = useStartShiftMutation();

  /* Reset form when dialog closes */

  useEffect(() => {
    if (!open) {
      setOpeningCash("");
      setOpeningCoins({
        "1": 0,
        "5": 0,
        "10": 0,
        "50": 0,
        "100": 0,
        "500": 0,
      });
    }
  }, [open]);

  const handleCoinChange = (coin, value) => {
    setOpeningCoins((prev) => ({
      ...prev,
      [coin]: Number(value) || 0,
    }));
  };

  const handleSubmit = async () => {
    try {
      await startShift({
        branchId,
        openingCash: Number(openingCash),
        openingCoins,
      }).unwrap();

      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">

        <DialogHeader>
          <DialogTitle>Start Shift</DialogTitle>
        </DialogHeader>

        {/* Opening cash */}
        <div className="space-y-2">
          <Label>Opening Cash</Label>
          <Input
            type="number"
            min="0"
            value={openingCash}
            onChange={(e) => setOpeningCash(e.target.value)}
          />
        </div>

        {/* Coins */}
        <div className="space-y-3 pt-3">
          <Label>Opening Coins</Label>

          <div className="grid grid-cols-2 gap-3">
            {COINS.map((coin) => (
              <div key={coin} className="space-y-1">
                <Label className="text-xs">LKR {coin}</Label>

                <Input
                  type="number"
                  min="0"
                  value={openingCoins[coin]}
                  onChange={(e) =>
                    handleCoinChange(coin, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error?.data?.message || "Failed to start shift"}
          </p>
        )}

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Starting..." : "Start Shift"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}