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

// 🔹 Create Refund
export const createRefund = createAsyncThunk(
  'refund/create',
  async (dto, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating refund...', { dto });
      
      const headers = getAuthHeaders();
      const res = await api.post('/api/refunds', dto, { headers });
      
      console.log('✅ Refund created successfully:', {
        refundId: res.data.id,
        totalAmount: res.data.totalAmount,
        cash: res.data.cash,
        credit: res.data.credit,
        customer: res.data.customer,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to create refund:', {
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        requestData: dto
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to create refund');
    }
  }
);

// 🔹 Get Refund by ID
export const getRefundById = createAsyncThunk(
  'refund/getById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching refund by ID...', { refundId: id });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/${id}`, { headers });
      
      console.log('✅ Refund fetched successfully:', {
        refundId: res.data.id,
        totalAmount: res.data.totalAmount,
        customer: res.data.customer,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch refund by ID:', {
        refundId: id,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Refund not found');
    }
  }
);

// 🔹 Get Refunds by Branch (with optional filters)
export const getRefundsByBranch = createAsyncThunk(
  'refund/getByBranch',
  async ({ branchId, customerId, cashierId, paymentType, status }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      // Build query params
      const params = [];
      if (customerId) params.push(`customerId=${customerId}`);
      if (cashierId) params.push(`cashierId=${cashierId}`);
      if (paymentType) params.push(`paymentType=${paymentType}`);
      if (status) params.push(`status=${status}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const res = await api.get(`/api/refunds/branch/${branchId}${query}`, { headers });
      console.log('✅ Refunds by branch response:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch refunds by branch:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch refunds');
    }
  }
);

// 🔹 Get Refunds by Cashier
// export const getRefundsByCashier = createAsyncThunk(
//   'refund/getByCashier',
//   async (cashierId, { rejectWithValue }) => {
//     try {
//       console.log('🔄 Fetching refunds by cashier...', { cashierId });
      
//       const headers = getAuthHeaders();
//       const res = await api.get(`/api/refunds/cashier/${cashierId}`, { headers });
      
//       console.log('✅ Refunds fetched successfully:', {
//         cashierId,
//         refundCount: res.data.length,
//         refunds: res.data.map(refund => ({
//           id: refund.id,
//           totalAmount: refund.totalAmount,
//           customer: refund.customer,
//           createdAt: refund.createdAt
//         }))
//       });
      
//       return res.data;
//     } catch (err) {
//       console.error('❌ Failed to fetch refunds by cashier:', {
//         cashierId,
//         error: err.response?.data || err.message,
//         status: err.response?.status,
//         statusText: err.response?.statusText
//       });
      
//       return rejectWithValue(err.response?.data?.message || 'Failed to fetch refunds');
//     }
//   }
// );
export const getRefundsByCashier = createAsyncThunk(
  "refund/getByCashier",
  async ({ cashierId, page = 0, size = 10, sort = "id,desc", start, end, search }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();

      // Build query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("size", size);
      params.append("sort", sort);
      if (start) params.append("start", start);   // ISO string e.g. 2025-11-01T00:00:00
      if (end) params.append("end", end);
      if (search) params.append("search", search);

      const res = await api.get(`/api/refunds/cashier/${cashierId}?${params.toString()}`, { headers });

      return {
        refunds: res.data.content,
        pageInfo: {
          page: res.data.number,
          size: res.data.size,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch refunds");
    }
  }
);


// 🔹 Get Today's Refunds by Branch
export const getTodayRefundsByBranch = createAsyncThunk(
  'refund/getTodayByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching today\'s refunds by branch...', { branchId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/today/branch/${branchId}`, { headers });
      
      console.log('✅ Today\'s refunds fetched successfully:', {
        branchId,
        refundCount: res.data.length,
        totalSales: res.data.reduce((sum, refund) => sum + refund.totalAmount, 0),
        refunds: res.data.map(refund => ({
          id: refund.id,
          totalAmount: refund.totalAmount,
          customer: refund.customer,
          createdAt: refund.createdAt
        }))
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch today\'s refunds by branch:', {
        branchId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch today\'s refunds');
    }
  }
);

// 🔹 Delete Refund
export const deleteRefund = createAsyncThunk(
  'refund/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Deleting refund...', { refundId: id });
      
      const headers = getAuthHeaders();
      await api.delete(`/api/refunds/${id}`, { headers });
      
      console.log('✅ Refund deleted successfully:', { refundId: id });
      
      return id;
    } catch (err) {
      console.error('❌ Failed to delete refund:', {
        refundId: id,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to delete refund');
    }
  }
);
export const getRefundsByCustomer = createAsyncThunk(
  'refund/getByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching refunds by customer...', { customerId });

      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/customer/${customerId}`, { headers });

      // Make sure we have an array
      const refunds = Array.isArray(res.data) ? res.data : res.data.refunds || [];

      const summary = {
        refundCount: refunds.length,
        totalSpent: refunds.reduce((sum, refund) => sum + refund.totalAmount, 0),
      };

      console.log('✅ Customer refunds fetched successfully:', { customerId, ...summary });

      return { refunds, summary };
    } catch (err) {
      console.error('❌ Failed to fetch customer refunds:', {
        customerId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });

      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch customer refunds');
    }
  }
);


// 🔹 Get Top 5 Recent Refunds by Branch
export const getRecentRefundsByBranch = createAsyncThunk(
  'refund/getRecentByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching top 5 recent refunds by branch...', { branchId });
      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/recent/${branchId}`, { headers });
      console.log('✅ Recent refunds fetched successfully:', {
        branchId,
        refundCount: res.data.length,
        refunds: res.data
      });
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch recent refunds by branch:', {
        branchId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recent refunds');
    }
  }
);
