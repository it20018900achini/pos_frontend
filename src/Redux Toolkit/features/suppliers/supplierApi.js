// src/Redux Toolkit/features/supplier/supplierApi.js
import api, { getAuthHeaders } from '@/utils/api';

export const fetchSuppliers = async ({ page = 0, size = 10, search = '' }) => {
  const response = await api.get('/api/suppliers', {
    headers: getAuthHeaders(),
    params: { page, size, search },
  });
  return response.data;
};

export const createSupplier = async (data) => {
  const response = await api.post('/api/suppliers', data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateSupplier = async (id, data) => {
  const response = await api.put(`/api/suppliers/${id}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await api.delete(`/api/suppliers/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
