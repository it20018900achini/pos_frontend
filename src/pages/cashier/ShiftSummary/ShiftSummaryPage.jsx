// src/pages/ShiftsPage.jsx
import React, { useState } from "react";
import ShiftList from "./shifts/ShiftList";
import ShiftDetails from "./shifts/ShiftDetails";
import CurrentShift from "./shifts/CurrentShift";
import EndShift from "./shifts/EndShift";
import POSHeader from "../components/POSHeader";
import { Button } from "../../../components/ui/button";
import ContentLayout from "../../Dashboard/ContentLayout";
import { useSelector } from "react-redux";
import StartShiftForm from "./shifts/StartShiftForm";

const ShiftSummaryPage = () => {
  const { selectedBranchId } = useSelector((state) => state.user);

  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <ContentLayout
      title="Shift Summary"
      subTitle="View and manage your current and past shifts."
      right={
        <div className="flex gap-2">
          <Button onClick={() => setOpenStart(true)}>
            Start Shift
          </Button>

          <Button variant="destructive" onClick={() => setOpenEnd(true)}>
            End Shift
          </Button>
        </div>
      }
    >
      <div className="space-y-4">

        <div className="flex justify-between gap-3 border rounded-lg w-full shadow-sm">
          <div className="w-full">
            <CurrentShift />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <ShiftList onSelect={setSelectedShiftId} />
          <ShiftDetails shiftId={selectedShiftId} />
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
export default ShiftSummaryPage