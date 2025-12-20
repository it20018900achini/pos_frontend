import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import api from "@/utils/api";

/* =========================
   Helpers
========================= */

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  },
});

/* =========================
   Thunks
========================= */

// Fetch all shifts
export const fetchShifts = createAsyncThunk(
  "shift/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/shifts", authConfig());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch current shift
export const fetchCurrentShift = createAsyncThunk(
  "shift/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/shifts/current", authConfig());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch shift by ID
export const fetchShiftById = createAsyncThunk(
  "shift/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/shifts/${id}`, authConfig());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Start shift
export const startShift = createAsyncThunk(
  "shift/start",
  async ({ branchId, openingCash }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/api/shifts/start",
        null,
        { ...authConfig(), params: { branchId, openingCash } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// End shift
export const endShift = createAsyncThunk(
  "shift/end",
  async ({ actualCash }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/api/shifts/end",
        null,
        { ...authConfig(), params: { actualCash } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   Slice
========================= */

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

      // Fetch all
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch current
      .addCase(fetchCurrentShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = action.payload;
      })

      // Fetch by ID
      .addCase(fetchShiftById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShift = action.payload;
      })

      // Start shift
      .addCase(startShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = action.payload;
        state.shifts.unshift(action.payload);
      })

      // End shift
      .addCase(endShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = null;

        const idx = state.shifts.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.shifts[idx] = action.payload;
      })

      // 🔥 Global loading handler
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // 🔥 Global error handler
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedShift } = shiftSlice.actions;
export default shiftSlice.reducer;
