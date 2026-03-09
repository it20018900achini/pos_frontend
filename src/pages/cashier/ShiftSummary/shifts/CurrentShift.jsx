import React from "react";

const CurrentShift = ({ currentShift }) => {
  if (!currentShift) {
    return (
      <div className="p-4 border rounded text-muted-foreground">
        No open shift
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Current Shift</h2>

      <p>
        <strong>Start:</strong>{" "}
        {new Date(currentShift.shiftStart).toLocaleString()}
      </p>

      <p>
        <strong>Opening Cash:</strong> {currentShift.openingCash}
      </p>

      <p>
        <strong>Expected Cash:</strong> {currentShift.expectedCash}
      </p>
    </div>
  );
};

export default CurrentShift;