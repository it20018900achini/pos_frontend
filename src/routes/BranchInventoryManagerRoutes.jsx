import React from "react";
import { Routes, Route } from "react-router";
import InventoryManagerDashboard from "../pages/InventoryManager/Dashboard/InventoryManagerDashboard";
import Dashboard from "../pages/InventoryManager/Dashboard/Dashboard";

// Import Branch Manager Dashboard Layout

// Import Branch Manager pages

// import PayrollOverview from "../pages/Branch Manager/payroll/PayrollOverview";

const BranchInventoryManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InventoryManagerDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
{/* 
        <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="balance-sheet" element={<BalanceSheet />} />
        <Route path="profit-loss" element={<ProfitLossReport />} />
            <Route path="/trial-balance" element={<TrialBalance />} />
            <Route path="/journals" element={<Journals />} />
    */}

        {/* <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
};

export default BranchInventoryManagerRoutes;