import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

// Helper function to get JWT token
const getAuthToken = () => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    throw new Error('No JWT token found');
  }
  return token;
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// 🔹 Get Store Overview (KPI Summary) - Updated with Date Range Params
export const getStoreOverview = createAsyncThunk(
  "storeAnalytics/getStoreOverview",
  async ({ storeId, start, end }, { rejectWithValue }) => {
    // 1. Pre-flight check: Prevent "undefined" from reaching the URL
    if (!storeId || storeId === "undefined") {
      console.error("🚫 getStoreOverview aborted: storeId is missing.");
      return rejectWithValue("Store ID is required to fetch analytics.");
    }

    try {
      console.log('🔄 Fetching store overview...', { storeId, start, end });
      
      const headers = getAuthHeaders();
      
      // 2. Axios correctly maps { params } to query strings (?start=...&end=...)
      const res = await api.get(`/api/store/analytics/${storeId}/overview`, { 
        headers,
        params: { start, end } 
      });
      
      console.log('✅ Store overview fetched successfully:', res.data);
      return res.data;
      
    } catch (err) {
      console.error('❌ Failed to fetch store overview:', err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch store overview"
      );
    }
  }
);

// 🔹 Get Sales Trends by Time (daily/weekly/monthly)
export const getSalesTrends = createAsyncThunk(
  "storeAnalytics/getSalesTrends",
  async ({ storeId, period }, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching sales trends...', { storeId, period });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/sales-trends?period=${period}`, { headers });
      
      console.log('✅ Sales trends fetched successfully:', {
        storeId,
        period,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch sales trends:', {
        storeId,
        period,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sales trends"
      );
    }
  }
);

// 🔹 Get Monthly Sales Chart (line)
export const getMonthlySales = createAsyncThunk(
  "storeAnalytics/getMonthlySales",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching monthly sales...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/sales/monthly`, { headers });
      
      console.log('✅ Monthly sales fetched successfully:', {
        storeId,
        dataPoints: res.data.length,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch monthly sales:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch monthly sales"
      );
    }
  }
);

// 🔹 Get Daily Sales Chart (line)
export const getDailySales = createAsyncThunk(
  "storeAnalytics/getDailySales",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching daily sales...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/sales/daily`, { headers });
      
      console.log('✅ Daily sales fetched successfully:', {
        storeId,
        dataPoints: res.data.length,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch daily sales:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch daily sales"
      );
    }
  }
);

// 🔹 Get Sales by Product Category (pie/bar)
export const getSalesByCategory = createAsyncThunk(
  "storeAnalytics/getSalesByCategory",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching sales by category...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/sales/category`, { headers });
      
      console.log('✅ Sales by category fetched successfully:', {
        storeId,
        categories: res.data.length,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch sales by category:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sales by category"
      );
    }
  }
);

// 🔹 Get Sales by Payment Method (pie)
export const getSalesByPaymentMethod = createAsyncThunk(
  "storeAnalytics/getSalesByPaymentMethod",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching sales by payment method...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/sales/payment-method`, { headers });
      
      console.log('✅ Sales by payment method fetched successfully:', {
        storeId,
        paymentMethods: res.data.length,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch sales by payment method:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sales by payment method"
      );
    }
  }
);

// 🔹 Get Sales by Branch (bar)
export const getSalesByBranch = createAsyncThunk(
  "storeAnalytics/getSalesByBranch",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching sales by branch...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/sales/branch`, { headers });
      
      console.log('✅ Sales by branch fetched successfully:', {
        storeId,
        branches: res.data.length,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch sales by branch:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sales by branch"
      );
    }
  }
);

// 🔹 Get Payment Breakdown (Cash, UPI, Card)
export const getPaymentBreakdown = createAsyncThunk(
  "storeAnalytics/getPaymentBreakdown",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching payment breakdown...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/payments`, { headers });
      
      console.log('✅ Payment breakdown fetched successfully:', {
        storeId,
        paymentTypes: res.data.length,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch payment breakdown:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch payment breakdown"
      );
    }
  }
);

// 🔹 Get Branch Performance
export const getBranchPerformance = createAsyncThunk(
  "storeAnalytics/getBranchPerformance",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching branch performance...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/branch-performance`, { headers });
      
      console.log('✅ Branch performance fetched successfully:', {
        storeId,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch branch performance:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch branch performance"
      );
    }
  }
);

// 🔹 Get Store Alerts and Health Monitoring
export const getStoreAlerts = createAsyncThunk(
  "storeAnalytics/getStoreAlerts",
  async (storeId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching store alerts...', { storeId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${storeId}/alerts`, { headers });
      
      console.log('✅ Store alerts fetched successfully:', {
        storeId,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch store alerts:', {
        storeId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch store alerts"
      );
    }
  }
); 