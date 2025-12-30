// LedgerDialog.js
"use client";

import React from "react";
import Ledger from "./Ledger";

function LedgerDialog({ accountCode }) {
  return (
    <div className="mt-4">
      <Ledger accountCode={accountCode} />
    </div>
  );
}

export default LedgerDialog;
