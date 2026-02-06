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
                 
                 
                  <Route path="branch/users" element={<BranchEmployees />} />

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
