// LedgerDialog.js
"use client";

import React from "react";
import Ledger from "./Ledger";

function LedgerDialog({ accountId }) {
  return (
    <div className="mt-4">
      <Ledger accountId={accountId} />
    </div>
  );
}

export default LedgerDialog;
