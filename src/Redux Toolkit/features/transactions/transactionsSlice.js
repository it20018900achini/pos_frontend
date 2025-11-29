import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/utils/api';

import { parseISO } from "date-fns";

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

/**
 * API contract expected:
 * GET /api/transactions/merged?branchIds=1,2&startDate=2025-11-01T00:00:00&endDate=2025-11-30T23:59:59&page=0&size=20
 * Response:
 * {
 *   content: [...],
 *   page: 0,
 *   size: 20,
 *   totalElements: 125,
 *   totalPages: 7
 * }
 */

// fetch paged
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchPaged",
  async ({ branchIds, startDate, endDate, paymentType, page = 0, size = 20 }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      params.append("branchIds", branchIds); // comma-separated e.g. "1,2"
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (paymentType) params.append("paymentType", paymentType);
      params.append("page", page);
      params.append("size", size);
      const headers = getAuthHeaders();

      const resp = await api.get(`/api/transactions/merged?${params.toString()}`,{headers});
      return resp.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// fetch all (no pagination)
export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async ({ branchIds, startDate, endDate, paymentType }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      params.append("branchIds", branchIds);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (paymentType) params.append("paymentType", paymentType);
      const headers = getAuthHeaders();

      const resp = await api.get(`/api/transactions/merged/all?${params.toString()}`,{headers});
      // resp should be an array of DTOs
      return resp.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  loading: false,
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  error: null,
  allLoading: false,
  allContent: [],
};

const slice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // optional: reset
    reset(state) {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload.content || [];
        state.page = action.payload.page ?? 0;
        state.size = action.payload.size ?? state.size;
        state.totalElements = action.payload.totalElements ?? 0;
        state.totalPages = action.payload.totalPages ?? 0;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message;
      })

      .addCase(fetchAllTransactions.pending, (state) => {
        state.allLoading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.allLoading = false;
        state.allContent = action.payload || [];
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.allLoading = false;
        state.error = action.payload?.message || action.error?.message;
      });
  }
});

export const { reset } = slice.actions;
export default slice.reducer;
