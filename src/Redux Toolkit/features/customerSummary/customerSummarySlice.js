import { createSlice } from "@reduxjs/toolkit";
import { getCustomerSummaryById } from "./customerSummaryThunks";

const initialState = {
  summary: null,
  loading: false,
  error: null,
};

const customerSummarySlice = createSlice({
  name: "customerSummary",

  initialState,

  reducers: {
    clearSummaryState: (state) => {
      state.summary = null;
      state.error = null;
      state.loading = false;
    },

    clearSelectedSummary: (state) => {
      state.summary = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ===============================
      // FETCH: Customer Summary by ID
      // ===============================
      .addCase(getCustomerSummaryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCustomerSummaryById.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload || null;
      })

      .addCase(getCustomerSummaryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load summary";
      })

      // ===============================
      // GLOBAL ERROR CATCHER FOR SLICE
      // ===============================
      .addMatcher(
        (action) =>
          action.type.startsWith("customerSummary/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload || action.error?.message || "Unexpected error";
          state.loading = false;
        }
      );
  },
});

// Export actions
export const { clearSummaryState, clearSelectedSummary } =
  customerSummarySlice.actions;

// Export reducer
export default customerSummarySlice.reducer;
