// src/Redux Toolkit/globleState.js
import { configureStore } from "@reduxjs/toolkit";

// ✅ Feature slices
import authReducer from "./features/auth/authSlice.js";
import storeReducer from "./features/store/storeSlice.js";
import branchReducer from "./features/branch/branchSlice.js";
import onboardingReducer from "./features/onboarding/onboardingSlice.js";
import userReducer from "./features/user/userSlice.js";
import productReducer from "./features/product/productSlice.js";
import categoryReducer from "./features/category/categorySlice.js";
import saleReducer from "./features/sale/saleSlice.js";
import transactionReducer from "./features/transaction/transactionSlice.js";
import inventoryReducer from "./features/inventory/inventorySlice.js";
import orderReducer from "./features/order/orderSlice.js";
import customerReducer from "./features/customer/customerSlice.js";
import employeeReducer from "./features/employee/employeeSlice.js";
import cartReducer from "./features/cart/cartSlice.js";
import shiftReportReducer from "./features/shiftReport/shiftReportSlice.js";
import refundReducer from "./features/refund/refundSlice.js";
import branchAnalysisReducer from "./features/branchAnalytics/branchAnalyticsSlice.js";
import storeAnalyticsReducer from "./features/storeAnalytics/storeAnalyticsSlice.js";
import adminDashboardReducer from "./features/adminDashboard/adminDashboardSlice.js";
import subscriptionPlanReducer from "./features/subscriptionPlan/subscriptionPlanSlice.js";
import subscriptionReducer from "./features/subscription/subscriptionSlice.js";
import paymentReducer from "./features/payment/paymentSlice.js";
import customerPaymentsSlice from "./features/customerPayment/customerPaymentSlice.js";
import customerSummaryReducer from "./features/customerSummary/customerSummarySlice.js";
import customerOrderReducer from "./features/customer/customerOrders/customerOrderSlice.js";
import customerRefundReducer from "./features/customer/customerRefunds/customerRefundSlice.js";
import transactionsReducer from "./features/transactions/transactionsSlice.js";
import shiftReducer from "./features/shift/shiftSlice";



import purchaseReducer from "./features/purchase/purchaseSlice.js";
import supplierReducer from "./features/suppliers/supplierSlice.js";
// ✅ RTK Query API
import { apiSlice } from "./api/apiSlice.js"; // base apiSlice
// import { orderApi } from "./features/order/orderApi.js"; // injected endpoints
import { payrollApi } from "./features/payroll/payrollApi";

// ✅ Configure store
const globleState = configureStore({
  reducer: {
    // Feature reducers
    auth: authReducer,
    store: storeReducer,
    branch: branchReducer,
    onboarding: onboardingReducer,
    user: userReducer,
    category: categoryReducer,
    product: productReducer,
    employee: employeeReducer,
    inventory: inventoryReducer,
    order: orderReducer,
    customer: customerReducer,
    sale: saleReducer,
    transaction: transactionReducer,
    cart: cartReducer,
    shiftReport: shiftReportReducer,
    refund: refundReducer,
    branchAnalytics: branchAnalysisReducer,
    storeAnalytics: storeAnalyticsReducer,
    adminDashboard: adminDashboardReducer,
    subscriptionPlan: subscriptionPlanReducer,
    subscription: subscriptionReducer,
    payment: paymentReducer,
    customerPayment: customerPaymentsSlice,
    customerSummary: customerSummaryReducer,
    customerOrder: customerOrderReducer,
    customerRefund: customerRefundReducer,
    transactions: transactionsReducer,
    shift: shiftReducer,

    purchase: purchaseReducer,   
    supplier: supplierReducer,   
    [payrollApi.reducerPath]: payrollApi.reducer,
    // ✅ RTK Query reducers (only apiSlice, orderApi injected here)
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // ✅ only once
});

export default globleState;
