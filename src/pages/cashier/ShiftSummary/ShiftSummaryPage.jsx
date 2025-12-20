// src/pages/ShiftsPage.jsx
import React, { useState } from "react";
import ShiftList from "./shifts/ShiftList";
import ShiftDetails from "./shifts/ShiftDetails";
import CurrentShift from "./shifts/CurrentShift";
import EndShift from "./shifts/EndShift";
import POSHeader from "../components/POSHeader";
import { Button } from "../../../components/ui/button";

const ShiftSummaryPage = () => {
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <POSHeader/>
      <div className="m-10 ">

      <div className="p-4 flex justify-between gap-3 border rounded-lg w-full bg-white shadow-sm">
        <div className="w-full">
          <CurrentShift />
        </div>
        
      <Button onClick={() => setOpen(true)}>
        End Shift
      </Button>

      <EndShift
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
      
      <div className="grid grid-cols-2 gap-6">
        <ShiftList onSelect={setSelectedShiftId} />
        <ShiftDetails shiftId={selectedShiftId} />
      </div></div>
    </div>
  );
};

export default ShiftSummaryPage;
