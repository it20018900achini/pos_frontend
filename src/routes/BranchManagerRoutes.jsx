import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthGuard from "../pages/common/AuthGuard";

/* Layout */
import BranchManagerDashboard from "../pages/Branch Manager/Dashboard/BranchManagerDashboard";

/* Main Pages */
import {
  Dashboard,
  Orders,
  Transactions,
  Inventory,
  Customers,
  Reports,
  Settings,
} from "../pages/Branch Manager";

/* Additional Pages */
import { BranchEmployees } from "../pages/Branch Manager/Employees";
import Refunds from "../pages/Branch Manager/Refunds/Refunds";
import SalesReport from "../pages/Branch Manager/Reports/SalesReport";
import InventoryReport from "../pages/Branch Manager/Reports/InventoryReport";
import Purchase from "../pages/Branch Manager/purchase/Purchase";
import Suppliers from "../pages/Branch Manager/supplier/Suppliers";
import PayrollPage from "../pages/Branch Manager/payroll/PayrollPage";
import SalaryPage from "../pages/Branch Manager/salary/SalaryPage";
import ExpensesPage from "../pages/Branch Manager/expense/ExpensesPage";
import ExpenseCategoriesPage from "../pages/Branch Manager/ExpenseCategories/ExpenseCategoriesPage";
import QuotationsPage from "../pages/Branch Manager/quotations/QuotationsPage";
import ChequesPage from "../pages/Branch Manager/Cheques/ChequesPage";
import AccountingDashboard from "../pages/Branch Manager/accounting/AccountingDashboard";
import UserActivities from "../pages/Branch Manager/accounting/UserActivities";
import InventoryPage from "../pages/Branch Manager/Inventory/InventoryPage";
import ChatPage from "../pages/Branch Manager/Chat/ChatPage";

const BranchManagerRoutes = () => {
  return (
    <AuthGuard allowedRoles={["BRANCH_MANAGER", "BRANCH_ADMIN"]}>
      <Routes>
        <Route element={<BranchManagerDashboard />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Orders / Transactions */}
          <Route path="orders" element={<Orders />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="cheques" element={<ChequesPage />} />

          {/* Inventory / Purchases / Suppliers */}
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory-page" element={<InventoryPage />} />
          <Route path="purchases" element={<Purchase />} />
          <Route path="suppliers" element={<Suppliers />} />

          {/* HR / Payroll */}
          <Route path="employees" element={<BranchEmployees />} />
          <Route path="payroll" element={<PayrollPage />} />
          <Route path="salary/:branchId" element={<SalaryPage />} />

          {/* Finance / Expenses */}
          <Route path="expense" element={<ExpensesPage />} />
          <Route path="expense/categories" element={<ExpenseCategoriesPage />} />
          <Route path="accounting" element={<AccountingDashboard />} />
          <Route path="user-activities" element={<UserActivities />} />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />
          <Route path="reports/sales" element={<SalesReport />} />
          <Route path="reports/inventory" element={<InventoryReport />} />

          {/* Customers / Chat */}
          <Route path="customers" element={<Customers />} />
          <Route path="chat" element={<ChatPage />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthGuard>
  );
};

export default BranchManagerRoutes;
