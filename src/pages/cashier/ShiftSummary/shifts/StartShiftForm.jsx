import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startShift, fetchShifts } from "../../../../Redux Toolkit/features/shift/shiftSlice";

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

const StartShiftForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [branchId, setBranchId] = useState("");
  const [openingCash, setOpeningCash] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branchId || !openingCash) {
      toast({
        title: "Missing fields",
        description: "Branch ID and Opening Cash are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        startShift({
          branchId: Number(branchId),
          openingCash: Number(openingCash),
        })
      ).unwrap();

      dispatch(fetchShifts());

      toast({
        title: "Shift Started",
        description: "New shift opened successfully",
      });

      onClose();
      setBranchId("");
      setOpeningCash("");
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to start shift",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Start New Shift</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Branch ID</Label>
            <Input
              type="number"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              placeholder="Enter branch ID"
            />
          </div>

          <div className="space-y-1">
            <Label>Opening Cash</Label>
            <Input
              type="number"
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
              placeholder="Enter opening cash"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Starting..." : "Start Shift"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartShiftForm;
