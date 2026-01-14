import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getOrderById,
  getOrdersByBranch,
  getOrdersByCashier,
  getTodayOrdersByBranch,
  deleteOrder,
  getOrdersByCustomer,
  getRecentOrdersByBranch,
  getOrdersByCustomerPagin,
  getRecentOrdersByBranchPagin,
} from "./orderThunks";

const initialState = {
  orders: [],
  todayOrders: [],
  customerOrders: [],
  selectedOrder: null,       // <-- track current order
  loading: false,
  error: null,
  recentOrders: [],
  pageInfo: null,
  search: "",
  startDate: null,
  endDate: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderState: (state) => {
      Object.assign(state, initialState);
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
    setCurrentOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
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

      // Orders by Branch
      .addCase(getOrdersByBranch.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      // Orders by Cashier (pagination)
      .addCase(getOrdersByCashier.pending, (state) => {
        state.loading = true;
      })
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

      // Orders by Customer (pagination)
      .addCase(getOrdersByCustomerPagin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrdersByCustomerPagin.fulfilled, (state, action) => {
        const data = action.payload;
        state.orders = data.content || [];
        state.pageInfo = {
          pageNumber: data.number ?? 0,
          pageSize: data.size ?? 20,
          totalPages: data.totalPages ?? 0,
          totalElements: data.totalElements ?? 0,
          first: data.first ?? false,
          last: data.last ?? false,
          numberOfElements: data.numberOfElements ?? 0,
        };
        state.loading = false;
      })
      .addCase(getOrdersByCustomerPagin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })

      // Today Orders
      .addCase(getTodayOrdersByBranch.fulfilled, (state, action) => {
        state.todayOrders = action.payload;
      })

      // Customer Orders
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

      // Recent Orders
      .addCase(getRecentOrdersByBranch.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      })

      // Recent Orders (pagination)
      .addCase(getRecentOrdersByBranchPagin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentOrdersByBranchPagin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.pageInfo = action.payload.pageInfo || null;
      })
      .addCase(getRecentOrdersByBranchPagin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generic error matcher
      .addMatcher(
        (action) =>
          action.type.startsWith("order/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearOrderState,
  clearCustomerOrders,
  setSearchFilter,
  setDateFilter,
  setCurrentOrder, // ✅ added
} = orderSlice.actions;

export default orderSlice.reducer;
