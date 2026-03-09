// src/pages/ShiftsPage.jsx
import React, { useEffect, useState } from "react";
import ShiftList from "./shifts/ShiftList";
import ShiftDetails from "./shifts/ShiftDetails";
import CurrentShift from "./shifts/CurrentShift";
import EndShift from "./shifts/EndShift";
import StartShiftForm from "./shifts/StartShiftForm";

import ContentLayout from "../../Dashboard/ContentLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchShifts,
  fetchCurrentShift,
} from "@/Redux Toolkit/features/shift/shiftSlice";

const ShiftSummaryPage = () => {
  const dispatch = useDispatch();

  const { selectedBranchId } = useSelector((state) => state.user);

  const {
    shifts,
    currentShift,
    loading,
    error,
    totalPages,
    currentPage,
    pageSize,
  } = useSelector((state) => state.shift);

  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  /* ---------------- Fetch shifts ---------------- */

  useEffect(() => {
    if (selectedBranchId) {
      dispatch(
        fetchShifts({
          branchId: selectedBranchId,
          page: currentPage || 0,
          size: pageSize || 10,
        })
      );
    }
  }, [dispatch, selectedBranchId, currentPage, pageSize]);

  /* ---------------- Fetch current shift ---------------- */

  useEffect(() => {
    // if (selectedBranchId && shifts.length>0) {
      dispatch(fetchCurrentShift(selectedBranchId));
    // }
  }, [dispatch, selectedBranchId]);

  /* ---------------- Auto select first shift ---------------- */

  useEffect(() => {
    if (shifts?.length > 0 && !selectedShiftId) {
      setSelectedShiftId(shifts[0].id);
    }
  }, [shifts, selectedShiftId]);

  /* ---------------- Pagination ---------------- */

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      dispatch(
        fetchShifts({
          branchId: selectedBranchId,
          page: currentPage + 1,
          size: pageSize,
        })
      );
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      dispatch(
        fetchShifts({
          branchId: selectedBranchId,
          page: currentPage - 1,
          size: pageSize,
        })
      );
    }
  };

  /* ---------------- Selected Shift ---------------- */

  const selectedShift = shifts?.find(
    (shift) => shift.id === selectedShiftId
  );

  /* ---------------- Loading ---------------- */

  if (loading && !shifts?.length) {
    return (
      <div className="p-4 flex items-center gap-2">
        <Loader2 className="animate-spin" />
        Loading shifts...
      </div>
    );
  }

  /* ---------------- Error ---------------- */

  if (error && error !== "No open shift found") {
  return (
    <ContentLayout title="Shift Summary">
      <div className="p-4 text-destructive">
        Failed to load shifts
      </div>
    </ContentLayout>
  );
}

  return (
    <ContentLayout
      title="Shift Summary"
      subTitle="View and manage your current and past shifts."
      right={
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenStart(true)}
            disabled={error && error == "No open shift found"?false:true}
          >
            Start Shift
          </Button>

          <Button
            variant="destructive"
            onClick={() => setOpenEnd(true)}
            disabled={error && error == "No open shift found"?true:false}
          >
            End Shift
          </Button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Current Shift */}
       {error && error == "No open shift found"?
       <div className="border rounded-lg shadow-sm p-5">
       No open shift found</div>:
      <div className="border rounded-lg shadow-sm ">
          <CurrentShift currentShift={currentShift} />
        </div>
 
      } 
        {/* Shift List + Details */}
        <div className="grid grid-cols-2 gap-6">

          <ShiftList
            shifts={shifts}
            selectedId={selectedShiftId}
            onSelect={setSelectedShiftId}
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNext}
            onPrev={handlePrev}
          />

          <ShiftDetails shift={selectedShift} />

        </div>

      </div>

      <StartShiftForm
        open={openStart}
        onClose={() => setOpenStart(false)}
        branchId={selectedBranchId}
      />

      <EndShift
        open={openEnd}
        onClose={() => setOpenEnd(false)}
      />
    </ContentLayout>
  );
};

export default ShiftSummaryPage;