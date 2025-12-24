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
import { BranchEmployees } from "../pages/Branch Manager/Employees";
import Refunds from "../pages/Branch Manager/Refunds/Refunds";
import SalesReport from "../pages/Branch Manager/Reports/SalesReport";
import InventoryReport from "../pages/Branch Manager/Reports/InventoryReport";
import Purchase from "../pages/Branch Manager/purchase/Purchase";
import Suppliers from "../pages/Branch Manager/supplier/Suppliers";
// import PayrollOverview from "../pages/Branch Manager/payroll/PayrollOverview";
// import PayrollGenerate from "../pages/Branch Manager/payroll/PayrollGenerate";
// import BranchPayroll from "../pages/Branch Manager/payroll/BranchPayroll";
// import EmployeePayroll from "../pages/Branch Manager/payroll/EmployeePayroll";
// import PayrollDetails from "../pages/Branch Manager/payroll/PayrollDetails";
// import PayrollAdmin from "../pages/Branch Manager/components/payroll/PayrollAdmin";
// import PayrollBranchManager from "../pages/Branch Manager/components/payroll/PayrollBranchManager";
import PayrollPage from "../pages/Branch Manager/payroll/PayrollPage";
import SalaryPage from "../pages/Branch Manager/salary/SalaryPage";
import ExpensesPage from "../pages/Branch Manager/expense/ExpensesPage";
import ExpenseCategoriesPage from "../pages/Branch Manager/ExpenseCategories/ExpenseCategoriesPage";
import QuotationsPage from "../pages/Branch Manager/quotations/QuotationsPage";

const BranchManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BranchManagerDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="purchases" element={<Purchase />} />
        <Route path="suppliers" element={<Suppliers />} />

            {/* <Route path="/payroll/overview" element={<PayrollOverview />} />
    <Route path="/payroll/generate" element={<PayrollGenerate />} />
    <Route path="/payroll/branch/:branchId" element={<BranchPayroll />} />
    <Route path="/payroll/employee/:employeeId" element={<EmployeePayroll />} />
    <Route path="/payroll/details/:payrollId" element={<PayrollDetails />} />
    <Route path="/payroll/config" element={<PayrollAdmin />} /> */}

      <Route path="/payroll" element={<PayrollPage />} />
      <Route path="/expense" element={<ExpensesPage />} />
      <Route path="/expense/categories" element={<ExpenseCategoriesPage />} />
      <Route path="/salary/:branchId" element={<SalaryPage />} />

        <Route path="orders" element={<Orders />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="quotations" element={<QuotationsPage />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="employees" element={<BranchEmployees />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/sales" element={<SalesReport />} />
        <Route path="reports/inventory" element={<InventoryReport />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default BranchManagerRoutes;