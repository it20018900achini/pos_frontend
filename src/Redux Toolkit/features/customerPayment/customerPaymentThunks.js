// src/features/customerPayment/customerPaymentThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/utils/api';

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
// Fetch payments with filters & pagination
// export const fetchPayments = createAsyncThunk(
//   "customerPayment/fetchPayments",
//   async ({ filters }) => {
//     const params = { ...filters };
//           const headers = getAuthHeaders();

//     const response = await api.get("/api/customer-payments/customer/7", { ...params,headers },);
//     return response.data;
//   }
// );

export const fetchPayments = createAsyncThunk(
  "customerPayment/fetchPayments",
  async ({ filters }) => {
            const headers = getAuthHeaders();

    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/customer-payments/customer7?${query}`,[headers]);
    return {
      payments: response.data.content, // if backend returns Page<CustomerPaymentDTO>
      totalPages: response.data.totalPages,
      currentPage: response.data.number,
    };
  }
);

// Fetch payments by customer paginated
export const fetchPaymentsByCustomer = createAsyncThunk(
  "customerPayment/fetchPaymentsByCustomer",
  async ({ customerId, page, size, sortBy, sortDir }) => {
        const headers = getAuthHeaders();

    const response = await api.get(`/api/customer-payments/customer/${customerId}/paginated`, {
      params: { page, size, sortBy, sortDir },
    },{headers});
    return response.data;
  }
);

// Create payment
export const createPayment = createAsyncThunk(
  "customerPayment/createPayment",
  async (payment) => {
          const headers = getAuthHeaders();

    const response = await api.post("/api/customer-payments", payment,{headers});
    return response.data;
  }
);

// Update payment
export const updatePayment = createAsyncThunk(
  "customerPayment/updatePayment",
  async ({ id, payment }) => {
          const headers = getAuthHeaders();

    const response = await api.put(`/api/customer-payments/${id}`, payment,{headers});
    return response.data;
  }
);

// Delete payment
export const deletePayment = createAsyncThunk(
  "customerPayment/deletePayment",
  async (id) => {
          const headers = getAuthHeaders();

    await api.delete(`/api/customer-payments/${id}`,{headers});
    return id;
  }
);
