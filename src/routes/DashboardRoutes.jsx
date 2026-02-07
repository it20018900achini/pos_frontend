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
import ChartOfAccounts from "../pages/Branch Manager/accounting/components/ChartOfAccounts";
import BalanceSheet from "../pages/Accountant/accounting/components/BalanceSheet";
import ProfitLossReport from "../pages/Accountant/accounting/components/ProfitLoss";
import TrialBalance from "../pages/Accountant/accounting/components/TrialBalance";
import Journals from "../pages/Accountant/accounting/Journals";

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
                 
      <Route path="branch/users/" element={<BranchEmployees />} />
      <Route path="branch/users/permissions" element={<RolesPage />} />

      
      <Route path="branch/accounts/chart-of-accounts" element={<ChartOfAccounts />} />
      <Route path="branch/accounts/balance-sheet" element={<BalanceSheet />} />
      <Route path="branch/accounts/profit-loss" element={<ProfitLossReport />} />
      <Route path="branch/accounts/trial-balance" element={<TrialBalance />} />
      <Route path="branch/accounts/journals" element={<Journals />} />
         
      

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
