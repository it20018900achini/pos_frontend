// src/Redux Toolkit/features/purchase/purchaseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './purchaseApi';

export const getPurchases = createAsyncThunk(
  'purchase/getPurchases',
  async (params, { rejectWithValue }) => {
    try {
      return await api.fetchPurchases(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addPurchase = createAsyncThunk(
  'purchase/addPurchase',
  async (purchase, { rejectWithValue }) => {
    try {
      return await api.createPurchase(purchase);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const purchaseSlice = createSlice({
  name: 'purchase',
  initialState: {
    purchases: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPurchases.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload.content;
        state.total = action.payload.totalElements;
      })
      .addCase(getPurchases.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addPurchase.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addPurchase.fulfilled, (state, action) => { state.loading = false; state.purchases.unshift(action.payload); })
      .addCase(addPurchase.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default purchaseSlice.reducer;