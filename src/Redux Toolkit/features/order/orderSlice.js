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
  recentOrders: [], // Added for recent orders
  pageInfo: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.orders = [];
      state.pageInfo= null,
      state.todayOrders = [];
      state.customerOrders = [];
      state.selectedOrder = null;
      state.error = null;
    },
    clearCustomerOrders: (state) => {
      state.customerOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.selectedOrder=action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })

      .addCase(getOrdersByBranch.fulfilled, (state, action) => {
        state.orders = action.payload;
      })



      .addCase(getOrdersByCashier.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrdersByCashier.fulfilled, (state, action) => {
        state.orders = action.payload.orders;       // ✅ array
        state.pageInfo = action.payload.pageInfo;
        state.loading = false;
      })
      .addCase(getOrdersByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];  // ✅ reset to empty array to be safe
      })



      // .addCase(getOrdersByCashier.fulfilled, (state, action) => {
      //   state.orders = action.payload;
      //   console.log("get order by cashier ", action.payload);
      // })

      .addCase(getTodayOrdersByBranch.fulfilled, (state, action) => {
        state.todayOrders = action.payload;
      })



      .addCase(getOrdersByCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrdersByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrders = action.payload;
      })
      .addCase(getOrdersByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })








      .addCase(getRecentOrdersByBranch.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      })

      .addMatcher(
        (action) => action.type.startsWith('order/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearOrderState, clearCustomerOrders } = orderSlice.actions;
export default orderSlice.reducer;
