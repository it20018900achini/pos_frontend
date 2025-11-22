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

// 🔹 Create Order
export const createOrder = createAsyncThunk(
  'order/create',
  async (dto, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating order...', { dto });
      
      const headers = getAuthHeaders();
      const res = await api.post('/api/orders', dto, { headers });
      
      console.log('✅ Order created successfully:', {
        orderId: res.data.id,
        totalAmount: res.data.totalAmount,
        cash: res.data.cash,
        credit: res.data.credit,
        customer: res.data.customer,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to create order:', {
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        requestData: dto
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

// 🔹 Get Order by ID
export const getOrderById = createAsyncThunk(
  'order/getById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching order by ID...', { orderId: id });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/${id}`, { headers });
      
      console.log('✅ Order fetched successfully:', {
        orderId: res.data.id,
        totalAmount: res.data.totalAmount,
        customer: res.data.customer,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch order by ID:', {
        orderId: id,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Order not found');
    }
  }
);

// 🔹 Get Orders by Branch (with optional filters)
export const getOrdersByBranch = createAsyncThunk(
  'order/getByBranch',
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
      const res = await api.get(`/api/orders/branch/${branchId}${query}`, { headers });
      console.log('✅ Orders by branch response:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch orders by branch:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// 🔹 Get Orders by Cashier
// export const getOrdersByCashier = createAsyncThunk(
//   'order/getByCashier',
//   async (cashierId, { rejectWithValue }) => {
//     try {
//       console.log('🔄 Fetching orders by cashier...', { cashierId });
      
//       const headers = getAuthHeaders();
//       const res = await api.get(`/api/orders/cashier/${cashierId}`, { headers });
      
//       console.log('✅ Orders fetched successfully:', {
//         cashierId,
//         orderCount: res.data.length,
//         orders: res.data.map(order => ({
//           id: order.id,
//           totalAmount: order.totalAmount,
//           customer: order.customer,
//           createdAt: order.createdAt
//         }))
//       });
      
//       return res.data;
//     } catch (err) {
//       console.error('❌ Failed to fetch orders by cashier:', {
//         cashierId,
//         error: err.response?.data || err.message,
//         status: err.response?.status,
//         statusText: err.response?.statusText
//       });
      
//       return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
//     }
//   }
// );
export const getOrdersByCashier = createAsyncThunk(
  "order/getByCashier",
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

      const res = await api.get(`/api/orders/cashier/${cashierId}?${params.toString()}`, { headers });

      return {
        orders: res.data.content,
        pageInfo: {
          page: res.data.number,
          size: res.data.size,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);
export const getOrdersByCustomerPagin = createAsyncThunk(
  "order/getByCustomerPagin",
  async ({ customerId, page = 0, size = 10, sort = "id,desc", start, end, search }, { rejectWithValue }) => {
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

      const res = await api.get(`/api/orders/customer/t/${customerId}?${params.toString()}`, { headers });

      return {
        orders: res.data.content,
        pageInfo: {
          page: res.data.number,
          size: res.data.size,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);


// 🔹 Get Today's Orders by Branch
export const getTodayOrdersByBranch = createAsyncThunk(
  'order/getTodayByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching today\'s orders by branch...', { branchId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/today/branch/${branchId}`, { headers });
      
      console.log('✅ Today\'s orders fetched successfully:', {
        branchId,
        orderCount: res.data.length,
        totalSales: res.data.reduce((sum, order) => sum + order.totalAmount, 0),
        orders: res.data.map(order => ({
          id: order.id,
          totalAmount: order.totalAmount,
          customer: order.customer,
          createdAt: order.createdAt
        }))
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch today\'s orders by branch:', {
        branchId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch today\'s orders');
    }
  }
);

// 🔹 Delete Order
export const deleteOrder = createAsyncThunk(
  'order/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Deleting order...', { orderId: id });
      
      const headers = getAuthHeaders();
      await api.delete(`/api/orders/${id}`, { headers });
      
      console.log('✅ Order deleted successfully:', { orderId: id });
      
      return id;
    } catch (err) {
      console.error('❌ Failed to delete order:', {
        orderId: id,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to delete order');
    }
  }
);

// 🔹 Get Orders by Customer
export const getOrdersByCustomer = createAsyncThunk(
  'order/getByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching orders by customer...', { customerId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/customer/${customerId}`, { headers });
      
      console.log('✅ Customer orders fetched successfully:', {
        customerId,
        orderCount: res.data.length,
        totalSpent: res.data.reduce((sum, order) => sum + order.totalAmount, 0),
        orders: res.data.map(order => ({
          id: order.id,
          totalAmount: order.totalAmount,
          customer: order.customer,
          createdAt: order.createdAt,
          paymentMethod: order.paymentMethod,
          status: order.status,
          items: order.items
        }))
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch customer orders:', {
        customerId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch customer orders');
    }
  }
);

// 🔹 Get Top 5 Recent Orders by Branch
export const getRecentOrdersByBranch = createAsyncThunk(
  'order/getRecentByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching top 5 recent orders by branch...', { branchId });
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/recent/${branchId}`, { headers });
      console.log('✅ Recent orders fetched successfully:', {
        branchId,
        orderCount: res.data.length,
        orders: res.data
      });
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch recent orders by branch:', {
        branchId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recent orders');
    }
  }
);
