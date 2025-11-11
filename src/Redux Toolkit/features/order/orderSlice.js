import { createSlice } from '@reduxjs/toolkit';
import {
  createOrder,
  getOrderById,
  getOrdersByBranch,
  getOrdersByCashier,
  getTodayOrdersByBranch,
  deleteOrder,
  getOrdersByCustomer,
  getRecentOrdersByBranch
} from './orderThunks';

const initialState = {
  orders: [],
  todayOrders: [],
  customerOrders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  recentOrders: [],
  pageInfo: null,
  search: '',
  startDate: null,
  endDate: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.orders = [];
      state.pageInfo = null;
      state.todayOrders = [];
      state.customerOrders = [];
      state.selectedOrder = null;
      state.error = null;
      state.search = '';
      state.startDate = null;
      state.endDate = null;
    },
    clearCustomerOrders: (state) => {
      state.customerOrders = [];
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
      // Create Order
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); // add to top
        state.selectedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Order by ID
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })

      // Get Orders by Branch
      .addCase(getOrdersByBranch.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      // Get Orders by Cashier (with pagination, search, date filter)
      .addCase(getOrdersByCashier.pending, (state) => { state.loading = true; })
      .addCase(getOrdersByCashier.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.pageInfo = action.payload.pageInfo || null;
        state.loading = false;
      })
      .addCase(getOrdersByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })

      // Today Orders
      .addCase(getTodayOrdersByBranch.fulfilled, (state, action) => {
        state.todayOrders = action.payload;
      })

      // Customer Orders
      .addCase(getOrdersByCustomer.pending, (state) => { state.loading = true; })
      .addCase(getOrdersByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrders = action.payload;
      })
      .addCase(getOrdersByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recent Orders
      .addCase(getRecentOrdersByBranch.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o.id !== action.payload);
      })

      // Generic error matcher
      .addMatcher(
        (action) => action.type.startsWith('order/') && action.type.endsWith('/rejected'),
        (state, action) => { state.error = action.payload; }
      );
  },
});

export const { clearOrderState, clearCustomerOrders, setSearchFilter, setDateFilter } = orderSlice.actions;
export default orderSlice.reducer;
