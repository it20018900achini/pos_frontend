import axios from "axios";
import { settings } from "../../../../../../constant";

const API_BASE = settings?.url+`/api/customer-payments`

const getAuthToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    throw new Error("No JWT token found");
  }
  return token;
};

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + getAuthToken(),
});

/* ✅ Create payment */
export const createPayment = async (data) => {
  return axios.post(`${API_BASE}`, data, {
    headers: authHeader(),
  });
};

/* ✅ Paginated get all payments */
export const getAllPayments = async (page = 0, size = 10, sort = "id,desc") => {
  return axios.get(`${API_BASE}?page=${page}&size=${size}&sort=${sort}`, {
    headers: authHeader(),
  });
};

/* ✅ Paginated get payments by customer */
export const getPaymentsByCustomer = async (
  customerId,
  page = 0,
  size = 10,
  sort = "id,desc"
) => {
  return axios.get(
    `${API_BASE}/customer/${customerId}?page=${page}&size=${size}&sort=${sort}`,
    {
      headers: authHeader(),
    }
  );
};

/* ✅ Paginated get payments by cashier */
export const getPaymentsByCashier = async (
  cashierId,
  page = 0,
  size = 10,
  sort = "id,desc"
) => {
  return axios.get(
    `${API_BASE}/cashier/${cashierId}?page=${page}&size=${size}&sort=${sort}`,
    {
      headers: authHeader(),
    }
  );
};
