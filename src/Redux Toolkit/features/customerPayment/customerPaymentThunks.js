import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

// 🔹 Create customerPayment
export const createCustomerPayment = createAsyncThunk('customerPayment/create', async ({ dto, token }, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/customerPayment', dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create customerPayment');
  }
});

// 🔹 Get customerPayment by store ID
export const getCategoriesByStore = createAsyncThunk('customerPayment/getByStore', async ({ storeId, token }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/customerPayment/store/${storeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch customerPayment');
  }
});

// 🔹 Update customerPayment
export const updateCustomerPayment = createAsyncThunk('customerPayment/update', async ({ id, dto, token }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/api/customerPayment/${id}`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update customerPayment');
  }
});

// 🔹 Delete customerPayment
export const deleteCustomerPayment = createAsyncThunk('customerPayment/delete', async ({ id, token }, { rejectWithValue }) => {
  try {
    await api.delete(`/api/customerPayment/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete customerPayment');
  }
});
