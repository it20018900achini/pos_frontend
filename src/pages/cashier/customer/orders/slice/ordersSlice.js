import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";  // axios instance

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().orders;

      const params = {
        page: filters.page,
        size: filters.size,
        branchId: filters.branchId || undefined,
        customerId: filters.customerId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };

      const response = await api.get("/orders", { params });
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
    error: null,
    data: [],
    totalPages: 0,
    totalElements: 0,

    filters: {
      page: 0,
      size: 20,
      branchId: null,
      customerId: null,
      startDate: null,
      endDate: null,
    },
  },

  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter } = ordersSlice.actions;
export default ordersSlice.reducer;
