import React from "react";
import { Routes, Route } from "react-router";

// Import Branch Manager Dashboard Layout
import BranchManagerDashboard from "../pages/Branch Manager/Dashboard/BranchManagerDashboard";

// Import Branch Manager pages
import {
  Dashboard,
  Orders,
  Transactions,
  Inventory,
  // Employees,
  Customers,
  Reports,
  Settings
} from "../pages/Branch Manager";
// import PayrollOverview from "../pages/Branch Manager/payroll/PayrollOverview";
// import PayrollGenerate from "../pages/Branch Manager/payroll/PayrollGenerate";
// import BranchPayroll from "../pages/Branch Manager/payroll/BranchPayroll";
// import EmployeePayroll from "../pages/Branch Manager/payroll/EmployeePayroll";
// import PayrollDetails from "../pages/Branch Manager/payroll/PayrollDetails";
// import PayrollAdmin from "../pages/Branch Manager/components/payroll/PayrollAdmin";
// import PayrollBranchManager from "../pages/Branch Manager/components/payroll/PayrollBranchManager";
import PayrollPage from "../pages/Branch Manager/payroll/PayrollPage";
import BranchAccountantDashboard from "../pages/Accountant/Dashboard/BranchAccountantDashboard";
import AccountingDashboard from "../pages/Branch Manager/accounting/AccountingDashboard";
import ChartOfAccounts from "../pages/Branch Manager/accounting/components/ChartOfAccounts";
import BalanceSheet from "../pages/Accountant/accounting/components/BalanceSheet";
import ProfitLossReport from "../pages/Accountant/accounting/components/ProfitLoss";
import TrialBalance from "../pages/Accountant/accounting/components/TrialBalance";
import JournalDashboard from "../pages/Accountant/accounting/JournalDashboard";
import Journals from "../pages/Accountant/accounting/Journals";

const BranchAccountantRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BranchAccountantDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="balance-sheet" element={<BalanceSheet />} />
        <Route path="profit-loss" element={<ProfitLossReport />} />
            <Route path="/trial-balance" element={<TrialBalance />} />
            <Route path="/journals" element={<Journals />} />
   

        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default BranchAccountantRoutes;