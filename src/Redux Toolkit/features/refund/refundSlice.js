import { createSlice } from '@reduxjs/toolkit';
import {
  createRefund,
  getRefundById,
  getRefundsByBranch,
  getRefundsByCashier,
  getTodayRefundsByBranch,
  deleteRefund,
  getRefundsByCustomer,
  getRecentRefundsByBranch
} from './refundThunks';

const initialState = {
  refunds: [],
  todayRefunds: [],
  customerRefunds: [],
  selectedRefund: null,
  loading: false,
  error: null,
  recentRefunds: [],
  pageInfo: null,
  search: '',
  startDate: null,
  endDate: null,
};

const refundSlice = createSlice({
  name: 'refund',
  initialState,
  reducers: {
    clearRefundState: (state) => {
      state.refunds = [];
      state.pageInfo = null;
      state.todayRefunds = [];
      state.customerRefunds = [];
      state.selectedRefund = null;
      state.error = null;
      state.search = '';
      state.startDate = null;
      state.endDate = null;
    },
    clearCustomerRefunds: (state) => {
      state.customerRefunds = [];
    },
    setSearchFilter: (state, action) => {
      state.search = action.payload;
    },
    setDateFilter: (state, action) => {
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Refund
      .addCase(createRefund.pending, (state) => { state.loading = true; })
      .addCase(createRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds.unshift(action.payload); // add to top
        state.selectedRefund = action.payload;
      })
      .addCase(createRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Refund by ID
      .addCase(getRefundById.fulfilled, (state, action) => {
        state.selectedRefund = action.payload;
      })

      // Get Refunds by Branch
      .addCase(getRefundsByBranch.fulfilled, (state, action) => {
        state.refunds = action.payload;
      })

      // Get Refunds by Cashier (with pagination, search, date filter)
      .addCase(getRefundsByCashier.pending, (state) => { state.loading = true; })
      .addCase(getRefundsByCashier.fulfilled, (state, action) => {
        state.refunds = action.payload.refunds || [];
        state.pageInfo = action.payload.pageInfo || null;
        state.loading = false;
      })
      .addCase(getRefundsByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.refunds = [];
      })

      // Today Refunds
      .addCase(getTodayRefundsByBranch.fulfilled, (state, action) => {
        state.todayRefunds = action.payload;
      })

      // Customer Refunds
      .addCase(getRefundsByCustomer.pending, (state) => { state.loading = true; })
      .addCase(getRefundsByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerRefunds = action.payload;
      })
      .addCase(getRefundsByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recent Refunds
      .addCase(getRecentRefundsByBranch.fulfilled, (state, action) => {
        state.recentRefunds = action.payload;
      })

      // Delete Refund
      .addCase(deleteRefund.fulfilled, (state, action) => {
        state.refunds = state.refunds.filter(o => o.id !== action.payload);
      })

      // Generic error matcher
      .addMatcher(
        (action) => action.type.startsWith('refund/') && action.type.endsWith('/rejected'),
        (state, action) => { state.error = action.payload; }
      );
  },
});

export const { clearRefundState, clearCustomerRefunds, setSearchFilter, setDateFilter } = refundSlice.actions;
export default refundSlice.reducer;
