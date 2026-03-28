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
export const fetchShifts = createAsyncThunk(
  "shift/fetchAll",
  async ({ branchId, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/shifts", {
        ...authConfig(),
        params: { branchId, page, size },
      });
      return data; // full Page object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchCurrentShift = createAsyncThunk(
  "shift/fetchCurrent",
  async (branchId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/shifts/current/${branchId}`,
        authConfig()
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

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
  currentPage: 0,
  totalPages: 0,
  pageSize: 10,
  totalElements: 0,
};

const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    clearSelectedShift: (state) => {
      state.selectedShift = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetShiftError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- Fetch Current Shift --- */
      .addCase(fetchCurrentShift.pending, (state) => {
        state.loading = true;
        state.currentShift = null; // Clear old branch data immediately on start
        state.error = null;
      })
      .addCase(fetchCurrentShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = action.payload;
      })
      .addCase(fetchCurrentShift.rejected, (state, action) => {
        state.loading = false;
        state.currentShift = null; // Ensure it's null if branch has no open shift
        state.error = action.payload;
      })

      /* --- Fetch All Shifts (Paginated) --- */
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload.content || [];
        state.currentPage = action.payload.number || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.pageSize = action.payload.size || 10;
        state.totalElements = action.payload.totalElements || 0;
      })

      /* --- Fetch Shift By ID --- */
      .addCase(fetchShiftById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShift = action.payload;
      })

      /* --- Start Shift --- */
      .addCase(startShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = action.payload;
        state.shifts.unshift(action.payload);
      })

      /* --- End Shift --- */
      .addCase(endShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = null;
        const idx = state.shifts.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.shifts[idx] = action.payload;
      })

      /* --- Global Matchers --- */
      // Global Pending (catches all thunks not explicitly handled above)
      .addMatcher(isPending, (state, action) => {
        // Skip fetchCurrentShift because we already cleared state in its specific .pending case
        if (action.type !== fetchCurrentShift.pending.type) {
          state.loading = true;
          state.error = null;
        }
      })

      // Global Rejected (catches all thunks not explicitly handled above)
      .addMatcher(isRejected, (state, action) => {
        // Skip fetchCurrentShift because we handled it above
        if (action.type !== fetchCurrentShift.rejected.type) {
          state.loading = false;
          state.error = action.payload;
        }
      });
  },
});

export const { clearSelectedShift, setPage, resetShiftError } = shiftSlice.actions;
export default shiftSlice.reducer;