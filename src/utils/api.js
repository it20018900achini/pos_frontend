// src/utils/api.js
import axios from 'axios';
import { settings } from '../constant';

// Create Axios instance
const api = axios.create({
  baseURL: settings?.url,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: Get JWT token from localStorage
export const getAuthToken = () => {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No JWT token found');
  return token;
};

// Helper: Get Authorization headers
export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
});

// Optional: Axios request interceptor to automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
