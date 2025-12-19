// src/pages/ShiftsPage.jsx
import React, { useState } from "react";
import ShiftList from "./shifts/ShiftList";
import ShiftDetails from "./shifts/ShiftDetails";
import CurrentShift from "./shifts/CurrentShift";
import StartShiftForm from "./shifts/StartShiftForm";
import POSHeader from "../components/POSHeader";
import EndShift from "./shifts/EndShift";

const ShiftSummaryPage = () => {
  const [selectedShiftId, setSelectedShiftId] = useState(null);

  return (
    <div>
      <POSHeader/>
      <EndShift/>
      <StartShiftForm />
      <CurrentShift />
      <div className="grid grid-cols-2 gap-6">
        <ShiftList onSelect={setSelectedShiftId} />
        <ShiftDetails shiftId={selectedShiftId} />
      </div>
    </div>
  );
};

export default ShiftSummaryPage;
