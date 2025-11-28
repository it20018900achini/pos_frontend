// src/redux/slices/customerRefundSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api"; // axios instance

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

// ===============================
// FETCH CUSTOMER ORDERS
// ===============================
export const fetchCustomerRefunds = createAsyncThunk(
  "customerRefund/fetch",
  async (
    {
      customerId,
      page = 0,
      size = 10,
      sortBy = "createdAt",
      sortDir = "desc",
      status,
      startDate,
      endDate,
    },
    thunkAPI
  ) => {
    try {
      // Build dynamic query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("size", size);
      params.append("sortBy", sortBy);
      params.append("sortDir", sortDir);

      if (status) params.append("status", status);
      if (startDate) {
  const formatted = new Date(startDate).toISOString();
  params.append("start", formatted);
}

if (endDate) {
  const formatted = new Date(endDate).toISOString();
  params.append("end", formatted);
}
      const headers = getAuthHeaders();

      const res = await api.get(
        `/api/refunds/customer/t/${customerId}?${params.toString()}`,
{headers}
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to load refunds");
    }
  }
);

// ===============================
// SLICE
// ===============================
const customerRefundSlice = createSlice({
  name: "customerRefund",
  initialState: {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0, // current page
    size: 10,
    sortBy: "createdAt",
    sortDir: "desc",
    status: "",
    startDate: "",
    endDate: "",
    loading: false,
    error: null,
  },

  reducers: {
    setPage: (state, action) => {
      state.number = action.payload;
    },

    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortDir = action.payload.sortDir;
    },

    setFilters: (state, action) => {
      state.status = action.payload.status || "";
      state.startDate = action.payload.startDate || "";
      state.endDate = action.payload.endDate || "";
    },

    resetFilters: (state) => {
      state.status = "";
      state.startDate = "";
      state.endDate = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload.content || [];
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.number = action.payload.number;
        state.size = action.payload.size;
      })
      .addCase(fetchCustomerRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// Export actions
export const { setPage, setSort, setFilters, resetFilters } =
  customerRefundSlice.actions;

// Export reducer
export default customerRefundSlice.reducer;
