// src/pages/ShiftsPage.jsx
import React, { useState } from "react";
import ShiftList from "./shifts/ShiftList";
import StartShiftForm from "./shifts/StartShiftForm";
import ShiftDetails from "./shifts/ShiftDetails";
import CurrentShift from "./shifts/CurrentShift";
import EndShift from "./shifts/EndShift";
import POSHeader from "../components/POSHeader";
import { Button } from "../../../components/ui/button";

const ShiftSummaryPage = () => {
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <div>
      {/* <POSHeader /> */}

      <div className="m-10 space-y-4">
        {/* 🔘 Actions */}
        <div className="flex justify-between gap-3">
        Shift Summary
          <Button variant="destructive" onClick={() => setOpenEnd(true)}>
            End Shift
          </Button>
        </div>

        {/* 📌 Current Shift */}
        <div className="p-4 flex justify-between gap-3 border rounded-lg w-full  shadow-sm">
          <div className="w-full">
            <CurrentShift />
          </div>
        </div>

        {/* 📋 Lists */}
        <div className="grid grid-cols-2 gap-6">
          <ShiftList onSelect={setSelectedShiftId} />
          <ShiftDetails shiftId={selectedShiftId} />
        </div>
      </div>

      {/* 🟢 Start Shift Dialog */}
      <StartShiftForm
        open={openStart}
        onClose={() => setOpenStart(false)}
      />

      {/* 🔴 End Shift Dialog */}
      <EndShift
        open={openEnd}
        onClose={() => setOpenEnd(false)}
      />
    </div>
  );
};

export default ShiftSummaryPage;
