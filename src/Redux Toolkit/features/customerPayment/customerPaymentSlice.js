import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

// Helper function to get JWT token
const getAuthToken = () => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    throw new Error('No JWT token found');
  }
  return token;
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
// Fetch payments (with filters, pagination, and sorting)
export const fetchPayments = createAsyncThunk(
  "/api/customerPayment/fetchPayments",
  async ({ filters }) => {
          const headers = getAuthHeaders();

    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/customer-payments/filter?${queryParams}`,{headers});
    return {
      payments: response.data.content,
      totalPages: response.data.totalPages,
      currentPage: response.data.number,
    };
  }
);

// Create payment
export const createPayment = createAsyncThunk(
  "/api/customerPayment/createPayment",
  async (payment) => {
          const headers = getAuthHeaders();

    const response = await api.post("/api/customer-payments", payment,{headers});
    return response.data;
  }
);

// Update payment
export const updatePayment = createAsyncThunk(
  "/api/customerPayment/updatePayment",
  async ({ id, payment }) => {
          const headers = getAuthHeaders();

    const response = await api.put(`/api/customer-payments/${id}`, payment,{headers});
    return response.data;
  }
);

// Delete payment
export const deletePayment = createAsyncThunk(
  "/api/customerPayment/deletePayment",
  async (id) => {
          const headers = getAuthHeaders();

    await api.delete(`/api/customer-payments/${id}`,{headers});
    return id;
  }
);

const customerPaymentSlice = createSlice({
  name: "customerPayment",
  initialState: {
    payments: [],
    loading: false,
    totalPages: 0,
    currentPage: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((p) => p.id !== action.payload);
      });
  },
});

export default customerPaymentSlice.reducer;
