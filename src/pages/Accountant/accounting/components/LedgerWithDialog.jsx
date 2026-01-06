"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Ledger from "./Ledger";

export default function LedgerWithDialog({ accountId }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="ml-2"
        >
          View Ledger
        </Button>
      </DialogTrigger>

        <DialogContent className="sm:max-w-[90%] overflow-y-auto h-screen">
        <DialogHeader>
          <DialogTitle>Ledger – {accountId}</DialogTitle>
        </DialogHeader>

        {/* Ledger inside dialog */}
        <Ledger accountId={accountId} />
      </DialogContent>
    </Dialog>
  );
}
