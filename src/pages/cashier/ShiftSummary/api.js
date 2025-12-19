import axios from "axios";

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

const token = getAuthToken();
// Base URL of your Spring Boot backend
const API = axios.create({
  baseURL: "http://localhost:5000/api/shifts", // adjust port if needed
  headers: {
    "Content-Type": "application/json",
'Authorization': `Bearer ${token}`,
  },
});

// Request interceptor (optional, e.g., for auth token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // if using JWT
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional global error handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
