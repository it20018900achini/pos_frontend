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

const BranchAccountantRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BranchAccountantDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="chart-of-accounts" element={<AccountingDashboard />} />
            {/* <Route path="/payroll/overview" element={<PayrollOverview />} />
    <Route path="/payroll/generate" element={<PayrollGenerate />} />
    <Route path="/payroll/branch/:branchId" element={<BranchPayroll />} />
    <Route path="/payroll/employee/:employeeId" element={<EmployeePayroll />} />
    <Route path="/payroll/details/:payrollId" element={<PayrollDetails />} />
    <Route path="/payroll/config" element={<PayrollAdmin />} /> */}

      <Route path="/payroll" element={<PayrollPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default BranchAccountantRoutes;