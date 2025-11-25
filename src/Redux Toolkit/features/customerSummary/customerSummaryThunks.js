import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ===============================
// JWT TOKEN HELPERS
// ===============================
const getAuthToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No JWT token found");
  return token;
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
});

// ===============================
// GET CUSTOMER SUMMARY BY ID
// ===============================
export const getCustomerSummaryById = createAsyncThunk(
  "customerSummary/getById",
  async (id, thunkAPI) => {
    try {
      console.log("🔄 Fetching Customer Summary...", { id });

      const res = await api.get(
        `/api/customers/summary/${id}`,
        { headers: getAuthHeaders() }
      );

      console.log("✅ Customer Summary Loaded:", res.data);
      return res.data;

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to fetch customer summary";

      console.error("❌ Error fetching Customer Summary:", {
        id,
        message,
        status: err.response?.status,
      });

      return thunkAPI.rejectWithValue(message);
    }
  }
);
