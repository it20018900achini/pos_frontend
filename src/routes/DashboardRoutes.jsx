import React from "react";
import { Navigate, Route, Routes } from "react-router";
import PageNotFound from "../pages/common/PageNotFound";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import { useSelector } from "react-redux";
import CreateOrderPage from "../pages/cashier/CreateOrderPage";
import ShiftSummaryPage from "../pages/cashier/ShiftSummary/ShiftSummaryPage";
import OrderHistoryPage from "../pages/cashier/order/OrderHistoryPage";
import ReturnOrderPage from "../pages/cashier/return/ReturnOrderPage";
import OrderRefundHistoryPage from "../pages/cashier/refund/OrderRefundHistoryPage";
import { BranchEmployees } from "../pages/Branch Manager/Employees";
import RolesPage from "../pages/Roles/RolesPage";
import ChartOfAccounts from "../pages/Accountant/accounting/components/ChartOfAccounts";
import BalanceSheet from "../pages/Accountant/accounting/components/BalanceSheet";
import ProfitLossReport from "../pages/Accountant/accounting/components/ProfitLoss";
import TrialBalance from "../pages/Accountant/accounting/components/TrialBalance";
import Journals from "../pages/Accountant/accounting/Journals";
import Products from "../pages/store/Product/Products";
import ProductVariantsPage from "../pages/store/ProductVariants/ProductVariantsPage";
import Categories from "../pages/store/Category/Categories";
import BrandsPage from "../pages/store/Brand/BrandsPage";
import { Orders, Transactions } from "../pages/Branch Manager";
import Refunds from "../pages/Branch Manager/Refunds/Refunds";
import QuotationsPage from "../pages/Branch Manager/quotations/QuotationsPage";
import Branches from "../pages/store/Branch/Branches";
import { Settings } from "../pages/store/store-admin";
import BranchSettings from "../pages/Branch Manager/Settings/Settings";
import { Inventory } from "../pages/InventoryManager";
import InventoryPage from "../pages/Branch Manager/Inventory/InventoryPage";
import Purchase from "../pages/InventoryManager/purchase/Purchase";
import Suppliers from "../pages/InventoryManager/supplier/Suppliers";
import InventoryMovements from "../pages/InventoryManager/Inventory/InventoryMovements";

import PayrollPage from "../pages/Branch Manager/payroll/PayrollPage";
import SalaryPage from "../pages/Branch Manager/salary/SalaryPage";
import StoreEmployees from "../pages/store/Employee/StoreEmployees";
import Onboarding from "../pages/onboarding/Onboarding";

const DashboardRoutes = () => {
  
    const { userProfile, loading, initialized } = useSelector(
    (state) => state.user
  );
  return (
    <Routes>


      <Route path="/" element={<DashboardLayout />}>


        <Route index element={<Dashboard />} />
        <Route path="pos" element={<CreateOrderPage/>} />
        <Route path="pos/shift-summary" element={<ShiftSummaryPage/>} />
        <Route path="pos/orders" element={<OrderHistoryPage />} />
        <Route path="pos/refunds" element={<OrderRefundHistoryPage />} />
                 
      <Route path="store/onboarding" element={<Onboarding />} />
      <Route path="store/branches" element={<Branches />} />

      <Route path="branch/users/" element={<BranchEmployees />} />
      <Route path="branch/users/permissions" element={<RolesPage />} />

      
      <Route path="branch/accounts/chart-of-accounts" element={<ChartOfAccounts />} />
      <Route path="branch/accounts/balance-sheet" element={<BalanceSheet />} />
      <Route path="branch/accounts/profit-loss" element={<ProfitLossReport />} />
      <Route path="branch/accounts/trial-balance" element={<TrialBalance />} />
      <Route path="branch/accounts/journals" element={<Journals />} />
         
      

        <Route path="store/users" element={<StoreEmployees />} />
        <Route path="store/products" element={<Products />} />
        <Route path="store/products/variants" element={<ProductVariantsPage />} />
        <Route path="store/products/categories" element={<Categories />} />
        <Route path="store/products/brands" element={<BrandsPage />} />
                

          <Route path="branch/orders" element={<Orders />} />
          <Route path="branch/orders/refunds" element={<Refunds />} />
          <Route path="branch/orders/quotations" element={<QuotationsPage />} />

          <Route path="branch/transactions" element={<Transactions />} />


          <Route path="branch/inventory" element={<Inventory />} />
          <Route path="branch/inventory/inventory-movements" element={<InventoryMovements />} />
          <Route path="branch/inventory/purchases" element={<Purchase />} />
          <Route path="branch/inventory/suppliers" element={<Suppliers />} />

          
          <Route path="branch/payroll" element={<PayrollPage />} />
          {/* <Route path="branch/salary/:branchId" element={<SalaryPage />} /> */}

          <Route path="settings" element={<Settings />} />
          <Route path="branch/settings" element={<BranchSettings />} />
          
      {/* {
        userProfile?.user?.role[0]=="BRANCH_CASHIER"&&null
      } */}
      
      </Route>
      <Route
        path="*"
        element={<PageNotFound/>}
      />
    </Routes>
  );
};

export default DashboardRoutes;
