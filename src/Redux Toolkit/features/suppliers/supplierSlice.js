// src/Redux Toolkit/features/supplier/supplierSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "./supplierApi";

// ---------------- THUNKS ----------------

export const getSuppliers = createAsyncThunk(
  "supplier/getSuppliers",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchSuppliers(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addSupplier = createAsyncThunk(
  "supplier/addSupplier",
  async (data, { rejectWithValue }) => {
    try {
      return await createSupplier(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editSupplier = createAsyncThunk(
  "supplier/editSupplier",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateSupplier(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeSupplier = createAsyncThunk(
  "supplier/removeSupplier",
  async (id, { rejectWithValue }) => {
    try {
      await deleteSupplier(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- SLICE ----------------

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    suppliers: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.content ?? [];
        state.total = action.payload.totalElements ?? 0;
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.suppliers.unshift(action.payload);
      })

      // UPDATE
      .addCase(editSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) state.suppliers[index] = action.payload;
      })

      // DELETE
      .addCase(removeSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(
          (s) => s.id !== action.payload
        );
      });
  },
});

export default supplierSlice.reducer;
