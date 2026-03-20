import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

// ---------------- Helper ----------------
const getErrorMessage = (err, fallback = "Request failed") =>
  err?.response?.data?.message || err?.message || fallback;

// ---------------- SIGNUP ----------------
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", userData);
      const data = res.data?.data;

      if (data?.jwt) {
        localStorage.setItem("jwt", data.jwt);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
      }

      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Signup failed"));
    }
  }
);

// ---------------- LOGIN ----------------
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // 🔥 clear expired token first
      localStorage.removeItem("jwt");
      delete api.defaults.headers.common["Authorization"];

      const res = await api.post("/auth/login", credentials);
      const data = res.data?.data;

      if (data?.jwt) {
        localStorage.setItem("jwt", data.jwt);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
      }

      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Login failed"
      );
    }
  }
);


// ---------------- LOGOUT ----------------
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT found");

      const res = await api.post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("jwt");
      delete api.defaults.headers.common["Authorization"];

      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Logout failed"));
    }
  }
);

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to send reset email"));
    }
  }
);

// ---------------- RESET PASSWORD ----------------
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/reset-password", { token, password });
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to reset password"));
    }
  }
);

// ---------------- SWITCH BRANCH ----------------
export const switchBranch = createAsyncThunk(
  "auth/switchBranch",
  async (branchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT found");

      const res = await api.post(
        `/auth/switch-branch?branchId=${branchId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Backend returns { token, branchId }
      const data = res.data;

      // ------------------ HANDLE TOKEN ------------------
      if (data?.token) {
        // Update localStorage
        localStorage.setItem("jwt", data.token);

        // Update axios default header immediately
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      } else {
        // If token not returned, keep old token in place
        console.warn(
          "[SWITCH BRANCH] No new token returned — keeping existing JWT"
        );
      }

      // ------------------ HANDLE BRANCH ID ------------------
      if (data?.branchId) {
        localStorage.setItem("branchId", data.branchId);
      }

      return data;
    } catch (err) {
      console.error("[SWITCH BRANCH ERROR]", err);

      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Switch branch failed"
      );
    }
  }
);