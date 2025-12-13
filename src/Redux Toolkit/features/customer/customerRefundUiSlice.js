// src/Redux Toolkit/features/customer/customerRefunds/customerRefundUiSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 0,
  sortBy: "createdAt",
  sortDir: "desc",
  status: "",
  startDate: "",
  endDate: "",
};

const customerRefundUiSlice = createSlice({
  name: "customerRefundUi",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortDir = action.payload.sortDir;
      state.page = 0;
    },
    setFilters: (state, action) => {
      Object.assign(state, action.payload);
      state.page = 0;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setPage,
  setSort,
  setFilters,
  resetFilters,
} = customerRefundUiSlice.actions;

export default customerRefundUiSlice.reducer;
