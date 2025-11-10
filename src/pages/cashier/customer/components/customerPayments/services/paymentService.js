import axios from "axios";

const API_BASE = "https://pos-dsxh.onrender.com/api/customer-payments";

const getAuthToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    throw new Error("No JWT token found");
  }
  return token;
};

// ✅ Create payment
export const createPayment = async (data) => {
  return axios.post(`${API_BASE}`, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getAuthToken(),
    },
  });
};

// ✅ Get payments by customer
export const getPaymentsByCustomer = async (customerId) => {
  return axios.get(`${API_BASE}/customer/${customerId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getAuthToken(),
    },
  });
};

// ✅ Get payments by cashier
export const getPaymentsByCashier = async (cashierId) => {
  return axios.get(`${API_BASE}/cashier/${cashierId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getAuthToken(),
    },
  });
};
