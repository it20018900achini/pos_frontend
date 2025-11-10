import { createSlice } from '@reduxjs/toolkit';
import {
  createCustomerPayment,
  getcustomerPaymentsByStore,
  updateCustomerPayment,
  deleteCustomerPayment,
} from './customerPaymentThunks';

const initialState = {
  customerPayments: [],
  loading: false,
  error: null,
};

const customerPaymentSlice = createSlice({
  name: 'customerPayment',
  initialState,
  reducers: {
    clearCustomerPaymentState: (state) => {
      state.customerPayments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomerPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomerPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.customerPayments.push(action.payload);
      })
      .addCase(createCustomerPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getcustomerPaymentsByStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(getcustomerPaymentsByStore.fulfilled, (state, action) => {
        state.loading = false;
        state.customerPayments = action.payload;
      })
      .addCase(getcustomerPaymentsByStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCustomerPayment.fulfilled, (state, action) => {
        const index = state.customerPayments.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.customerPayments[index] = action.payload;
        }
      })

      .addCase(deleteCustomerPayment.fulfilled, (state, action) => {
        state.customerPayments = state.customerPayments.filter((c) => c.id !== action.payload);
      })

      .addMatcher(
        (action) => action.type.startsWith('customerPayment/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearCustomerPaymentState } = customerPaymentSlice.actions;
export default customerPaymentSlice.reducer;
