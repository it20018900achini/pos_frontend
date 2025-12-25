"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import all accounting components
import BalanceSheet from "./components/BalanceSheet";
import ProfitLoss from "./components/ProfitLoss";
import TrialBalance from "./components/TrialBalance";
import ChartOfAccounts from "./components/ChartOfAccounts";
import JournalDashboard from "./JournalDashboard";
import JournalByAccount from "./components/JournalByAccount";

export default function AccountingDashboard() {
  const [tab, setTab] = useState("balance-sheet");

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-3xl font-bold mb-4">Accounting Dashboard</h1>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="journals">Journal</TabsTrigger>
          <TabsTrigger value="coa">Chart of Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="balance-sheet">
          <BalanceSheet />
        </TabsContent>

        <TabsContent value="profit-loss">
          <ProfitLoss />
        </TabsContent>

        <TabsContent value="trial-balance">
          <TrialBalance />
        </TabsContent>

        <TabsContent value="journals">
          <JournalDashboard />
          <JournalByAccount/>
        </TabsContent>

        <TabsContent value="coa">
          <ChartOfAccounts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
