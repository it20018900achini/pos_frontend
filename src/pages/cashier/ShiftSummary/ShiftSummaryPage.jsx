"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader2, Plus, LogOut, History, Info, AlertCircle } from "lucide-react";

// Components
import ShiftList from "./shifts/ShiftList";
import ShiftDetails from "./shifts/ShiftDetails";
import CurrentShift from "./shifts/CurrentShift";
import EndShift from "./shifts/EndShift";
import StartShiftForm from "./shifts/StartShiftForm";

import ContentLayout from "../../Dashboard/ContentLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

  const noShiftFound = error === "No open shift found";

  /* ---------------- Fetch logic ---------------- */
  useEffect(() => {
    if (selectedBranchId) {
      dispatch(fetchShifts({ branchId: selectedBranchId, page: currentPage || 0, size: pageSize || 10 }));
      dispatch(fetchCurrentShift(selectedBranchId));
    }
  }, [dispatch, selectedBranchId, currentPage, pageSize]);

  useEffect(() => {
    if (shifts?.length > 0 && !selectedShiftId) {
      setSelectedShiftId(shifts[0].id);
    }
  }, [shifts, selectedShiftId]);

  /* ---------------- Pagination ---------------- */
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      dispatch(fetchShifts({ branchId: selectedBranchId, page: currentPage + 1, size: pageSize }));
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      dispatch(fetchShifts({ branchId: selectedBranchId, page: currentPage - 1, size: pageSize }));
    }
  };

  const selectedShift = shifts?.find((shift) => shift.id === selectedShiftId);

  if (loading && !shifts?.length) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading shifts...</p>
        </div>
      </div>
    );
  }

  return (
    <ContentLayout
      title="Shift Summary"
      subTitle="Manage daily terminal operations and cash flow."
      right={
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setOpenStart(true)}
            disabled={!noShiftFound}
            className="shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" /> Start New Shift
          </Button>

          <Button
            variant="destructive"
            onClick={() => setOpenEnd(true)}
            disabled={noShiftFound}
            className="shadow-sm gap-2"
          >
            <LogOut className="h-4 w-4" /> End Current Shift
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column: Current Status & History List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Shift Card */}
          <Card className="border-l-4 border-l-primary shadow-sm overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Active Session
                </CardTitle>
              </div>
              <Badge variant={noShiftFound ? "secondary" : "default"} className="px-3 py-1">
                {noShiftFound ? "Offline" : "Live Now"}
              </Badge>
            </CardHeader>
            <CardContent>
              {noShiftFound ? (
                <div className="flex items-center gap-3 py-4 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm italic">No open shift found. Start one to begin sales.</p>
                </div>
              ) : (
                <CurrentShift currentShift={currentShift} />
              )}
            </CardContent>
          </Card>

          {/* History List Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                <History className="h-5 w-5" />
                <span>Shift History</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ShiftList
                shifts={shifts}
                selectedId={selectedShiftId}
                onSelect={setSelectedShiftId}
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-7">
          <Card className="h-full shadow-sm">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle>Session Details</CardTitle>
              </div>
              <CardDescription>
                Detailed breakdown of the selected shift activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {selectedShift ? (
                <ShiftDetails shift={selectedShift} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-2">
                   <History className="h-10 w-10 opacity-20" />
                   <p>Select a shift from the list to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Forms/Modals */}
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