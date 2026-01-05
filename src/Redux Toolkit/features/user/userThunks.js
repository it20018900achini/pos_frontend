import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

/* ---------------- PROFILE ---------------- */

export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to fetch profile'
      );
    }
  }
);

/* ---------------- USERS ---------------- */

export const getCustomers = createAsyncThunk(
  'user/getCustomers',
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/users/customer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch customers');
    }
  }
);

export const getCashiers = createAsyncThunk(
  'user/getCashiers',
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/users/cashier', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch cashiers');
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'user/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/list');
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

export const getUserById = createAsyncThunk(
  'user/getById',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue('User not found');
    }
  }
);

/* ---------------- LOGOUT ---------------- */

export const logout = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('jwt');
  return true;
});
