import api, { getAuthHeaders } from '@/utils/api2';

export const fetchPurchases = async ({ page = 0, size = 10, search = '', from, to }) => {
  const response = await api.get('/api/purchases/search', {
    headers: getAuthHeaders(),
    params: { page, size, supplierKeyword: search, startDate: from, endDate: to },
  });
  return response.data;
};

export const createPurchase = async (data) => {
  const response = await api.post('/api/purchases', data, { headers: getAuthHeaders() });
  return response.data;
};
