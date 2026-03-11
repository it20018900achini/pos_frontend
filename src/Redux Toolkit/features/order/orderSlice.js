import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

// Helper: get JWT token
const getAuthToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No JWT token found");
  return token;
};

// Helper: set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ---------------------- THUNKS ----------------------

// 🔹 Create Order
export const createOrder = createAsyncThunk(
  "order/create",
  async (dto, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post("/api/orders", dto, { headers });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create order");
    }
  }
);

// 🔹 Get Order by ID
export const getOrderById = createAsyncThunk(
  "order/getById",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/${id}`, { headers });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  }
);

// 🔹 Get Orders by Branch
export const getOrdersByBranch = createAsyncThunk(
  "order/getByBranch",
  async ({ branchId, customerId, cashierId, paymentType, status }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const params = [];
      if (customerId) params.push(`customerId=${customerId}`);
      if (cashierId) params.push(`cashierId=${cashierId}`);
      if (paymentType) params.push(`paymentType=${paymentType}`);
      if (status) params.push(`status=${status}`);
      const query = params.length ? `?${params.join("&")}` : "";
      const res = await api.get(`/api/orders/branch/${branchId}/pagin/${query}`, { headers });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// 🔹 Get Orders by Cashier (paginated)
export const getOrdersByCashier = createAsyncThunk(
  "order/getByCashier",
  async ({ cashierId, page = 0, size = 10, sort = "id,desc", start, end, search }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams({ page, size, sort });
      if (start) params.append("start", new Date(start).toISOString());
      if (end) params.append("end", new Date(end).toISOString());
      if (search) params.append("search", search);
      const res = await api.get(`/api/orders/cashier/${cashierId}?${params.toString()}`, { headers });
      return { orders: res.data.content, pageInfo: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// 🔹 Get Orders by Customer (paginated)
export const getOrdersByCustomerPagin = createAsyncThunk(
  "order/getByCustomerPagin",
  async ({ customerId, page = 0, size = 10, sort = "id,desc", start, end, search }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams({ page, size, sort });
      if (start) params.append("start", new Date(start).toISOString());
      if (end) params.append("end", new Date(end).toISOString());
      if (search) params.append("search", search);
      const res = await api.get(`/api/orders/customer/t/${customerId}?${params.toString()}`, { headers });
      return { orders: res.data.content, pageInfo: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// 🔹 Get Today's Orders by Branch
export const getTodayOrdersByBranch = createAsyncThunk(
  "order/getTodayByBranch",
  async (branchId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/today/branch/${branchId}`, { headers });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch today's orders");
    }
  }
);

// 🔹 Delete Order
export const deleteOrder = createAsyncThunk(
  "order/delete",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      await api.delete(`/api/orders/${id}`, { headers });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete order");
    }
  }
);

// 🔹 Get Orders by Customer
export const getOrdersByCustomer = createAsyncThunk(
  "order/getByCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/customer/${customerId}`, { headers });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch customer orders");
    }
  }
);

// 🔹 Get Recent Orders (Top 5)
export const getRecentOrdersByBranch = createAsyncThunk(
  "order/getRecentByBranch",
  async (branchId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/recent/${branchId}`, { headers });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch recent orders");
    }
  }
);

// 🔹 Get Recent Orders by Branch (Paginated)
export const getRecentOrdersByBranchPagin = createAsyncThunk(
  "order/getRecentByBranchPagin",
  async ({ branchId, page = 0, size = 10, sort = "id,desc", start, end, search }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams({ page, size, sort });
      if (start) params.append("start", new Date(start).toISOString());
      if (end) params.append("end", new Date(end).toISOString());
      if (search) params.append("search", search);
      const res = await api.get(`/api/orders/branch/${branchId}/pagin?${params.toString()}`, { headers });
      return { orders: res.data.content, pageInfo: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch paginated recent orders");
    }
  }
);

// 🔹 Get Recent Orders by Store (Paginated)
export const getRecentOrdersByStorePagin = createAsyncThunk(
  "order/getRecentByStorePagin",
  async ({ storeId, page = 0, size = 10, sort = "id,desc", start, end, search }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams({ page, size, sort });
      if (start) params.append("start", new Date(start).toISOString());
      if (end) params.append("end", new Date(end).toISOString());
      if (search) params.append("search", search);
      const res = await api.get(`/api/orders/store/${storeId}?${params.toString()}`, { headers });
      return { orders: res.data.content, pageInfo: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch paginated recent orders");
    }
  }
);

// ---------------------- SLICE ----------------------
const initialState = {
  orders: [],
  todayOrders: [],
  customerOrders: [],
  selectedOrder: null,
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
    clearOrderState: (state) => Object.assign(state, initialState),
    clearCustomerOrders: (state) => { state.customerOrders = []; },
    setSearchFilter: (state, action) => { state.search = action.payload; },
    setDateFilter: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setCurrentOrder: (state, action) => { state.selectedOrder = action.payload; },
  },
  extraReducers: (builder) => {
    // ✅ All addCase first
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.selectedOrder = action.payload;
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

      .addCase(getOrdersByCashier.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.pageInfo = action.payload.pageInfo || null;
        state.loading = false;
      })

      .addCase(getOrdersByCustomerPagin.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.pageInfo = action.payload.pageInfo || null;
        state.loading = false;
      })

      .addCase(getTodayOrdersByBranch.fulfilled, (state, action) => {
        state.todayOrders = action.payload;
      })

      .addCase(getOrdersByCustomer.fulfilled, (state, action) => {
        state.customerOrders = action.payload;
        state.loading = false;
      })

      .addCase(getRecentOrdersByBranch.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      })

      .addCase(getRecentOrdersByBranchPagin.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.pageInfo = action.payload.pageInfo || null;
        state.loading = false;
      })

      .addCase(getRecentOrdersByStorePagin.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.pageInfo = action.payload.pageInfo || null;
        state.loading = false;
      });

    // ✅ addMatcher last
    builder
      .addMatcher(
        (action) => action.type.startsWith("order/") && action.type.endsWith("/pending"),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.startsWith("order/") && action.type.endsWith("/rejected"),
        (state, action) => { state.loading = false; state.error = action.payload; }
      );
  },
});

export const {
  clearOrderState,
  clearCustomerOrders,
  setSearchFilter,
  setDateFilter,
  setCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;