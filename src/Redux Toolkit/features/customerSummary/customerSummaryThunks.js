import { createAsyncThunk } from '@reduxjs/toolkit';
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

// 🔹 Get CustomerSummary by ID
export const getCustomerSummaryById = createAsyncThunk(
  'customer/getById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching customer by ID...', { customerId: id });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/customers/summary/${id}`, { headers });
      
      console.log('✅ CustomerSummary fetched successfully:', res.data);
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch customer by ID:', {
        customerId: id,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'CustomerSummary not found');
    }
  }
);

