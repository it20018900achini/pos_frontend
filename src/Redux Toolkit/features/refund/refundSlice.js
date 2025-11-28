import { createSlice } from '@reduxjs/toolkit';
import {
  createRefund,
  getRefundById,
  getRefundsByBranch,
  getRefundsByCashier,
  getTodayRefundsByBranch,
  deleteRefund,
  getRefundsByCustomer,
  getRecentRefundsByBranch,
  getRecentRefundsByBranchPagin
} from './refundThunks';

const initialState = {
  refunds: [],
  todayRefunds: [],
  customerRefunds: [],
  selectedRefund: null,
  loading: false,
  error: null,
  recentRefunds: [],
  recentRefundsPagin: [],
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
      state.recentRefunds = [];
      state.recentRefundsPagin = [];
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
        state.refunds.unshift(action.payload);
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

      // Get Refunds by Cashier
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
      .addCase(getRefundsByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundsByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerRefunds = action.payload;
      })
      .addCase(getRefundsByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Recent Refunds (Top 5)
      .addCase(getRecentRefundsByBranch.fulfilled, (state, action) => {
        state.recentRefunds = action.payload;
      })


.addCase(getRecentRefundsByBranchPagin.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(getRecentRefundsByBranchPagin.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
.addCase(getRecentRefundsByBranchPagin.fulfilled, (state, action) => {
  state.loading = false;
  state.pageInfo = action.payload.pageInfo || null;
  state.refunds=action.payload.refunds||[]
})

      // Recent Refunds with Pagination + Filter
      // .addCase(getRecentRefundsByBranchPagin.fulfilled, (state, action) => {
      //   state.recentRefundsPagin = action.payload.refunds || [];
      //   state.pageInfo = action.payload.pageInfo || null;

      //   // Apply search & date filter immediately
      //   const { search, startDate, endDate } = state;
      //   state.recentRefundsPagin = state.recentRefundsPagin.filter((refund) => {
      //     const matchesSearch = search
      //       ? refund.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      //         refund.items?.some(item =>
      //           item.product?.name?.toLowerCase().includes(search.toLowerCase())
      //         )
      //       : true;

      //     const refundDate = dayjs(refund.createdAt);
      //     const matchesStart = startDate ? refundDate.isAfter(dayjs(startDate).subtract(1, 'day')) : true;
      //     const matchesEnd = endDate ? refundDate.isBefore(dayjs(endDate).add(1, 'day')) : true;

      //     return matchesSearch && matchesStart && matchesEnd;
      //   });
      // })

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
