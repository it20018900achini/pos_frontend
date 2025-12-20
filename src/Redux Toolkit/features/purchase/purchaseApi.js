// src/Redux Toolkit/features/purchase/purchaseApi.js
import api, { getAuthHeaders } from '@/utils/api';

export const fetchPurchases = async ({ page = 0, size = 10, search = '', from, to }) => {
  const response = await api.get('/api/purchases', {
    headers: getAuthHeaders(),
    params: { page, size, search, from, to },
  });
  return response.data;
};

export const createPurchase = async (data) => {
  const response = await api.post('/api/purchases', data, { headers: getAuthHeaders() });
  return response.data;
};