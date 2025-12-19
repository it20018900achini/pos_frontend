// src/redux/features/shift/shiftSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ------------------- Helpers -------------------

// Get JWT token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No JWT token found");
  return token;
};

// Prepare headers with JWT
const getAuthHeaders = () => ({
  "Authorization": `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
});

// ------------------- Thunks -------------------

// Fetch all shifts
export const fetchShifts = createAsyncThunk(
  "shift/fetchShifts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/shifts", { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch current open shift
export const fetchCurrentShift = createAsyncThunk(
  "shift/fetchCurrentShift",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/shifts/current", { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch shift by ID
export const fetchShiftById = createAsyncThunk(
  "shift/fetchShiftById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/shifts/${id}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Start a shift
export const startShift = createAsyncThunk(
  "shift/startShift",
  async ({ branchId, openingCash }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/shifts/start",
        null, // No body needed for @RequestParam
        { params: { branchId, openingCash }, headers: getAuthHeaders() }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// End a shift
export const endShift = createAsyncThunk(
  "shift/endShift",
  async ({ actualCash }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/shifts/end",
        null, // No body needed
        { params: { actualCash }, headers: getAuthHeaders() }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ------------------- Slice -------------------

const initialState = {
  shifts: [],
  currentShift: null,
  selectedShift: null,
  loading: false,
  error: null,
};

const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    clearSelectedShift: (state) => {
      state.selectedShift = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all shifts
      .addCase(fetchShifts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchShifts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch current shift
      .addCase(fetchCurrentShift.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCurrentShift.fulfilled, (state, action) => { state.loading = false; state.currentShift = action.payload; })
      .addCase(fetchCurrentShift.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch shift by ID
      .addCase(fetchShiftById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchShiftById.fulfilled, (state, action) => { state.loading = false; state.selectedShift = action.payload; })
      .addCase(fetchShiftById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Start shift
      .addCase(startShift.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(startShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = action.payload;
        state.shifts.push(action.payload);
      })
      .addCase(startShift.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // End shift
      .addCase(endShift.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(endShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = null;
        const index = state.shifts.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.shifts[index] = action.payload;
      })
      .addCase(endShift.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearSelectedShift } = shiftSlice.actions;
export default shiftSlice.reducer;
