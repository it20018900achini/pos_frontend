import { createSlice } from '@reduxjs/toolkit';
import {

  getCustomerSummaryById,
} from './customerSummaryThunks';

const initialState = {
  customers: [],
  summary: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearCustomerState: (state) => {
      state.customers = [];
      state.summary = null;
      state.error = null;
    },
    clearSelectedCustomer: (state) => {
      state.summary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      

      // Get Customer by ID
      .addCase(getCustomerSummaryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerSummaryById.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getCustomerSummaryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generic error handling for all customer actions
      .addMatcher(
        (action) => action.type.startsWith('customer/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearCustomerState, clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer; 