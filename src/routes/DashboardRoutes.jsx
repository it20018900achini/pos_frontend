import React from "react";
import { Navigate, Route, Routes } from "react-router";
import CashierDashboardLayout from "../pages/cashier/CashierDashboardLayout";
import CreateOrderPage from "../pages/cashier/CreateOrderPage";
import ReturnOrderPage from "../pages/cashier/return/ReturnOrderPage";
import OrderHistoryPage from "../pages/cashier/order/OrderHistoryPage";
import CustomerLookupPage from "../pages/cashier/customer/CustomerLookupPage";
import ShiftSummaryPage from "../pages/cashier/ShiftSummary/ShiftSummaryPage";
import PageNotFound from "../pages/common/PageNotFound";
import OrderRefundHistoryPage from "../pages/cashier/refund/OrderRefundHistoryPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import { useSelector } from "react-redux";

const DashboardRoutes = () => {
    const { userProfile, loading, initialized } = useSelector(
    (state) => state.user
  );
  return (
    <Routes>


      <Route path="/" element={<DashboardLayout />}>


        <Route index element={<Dashboard />} />
        
      
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
