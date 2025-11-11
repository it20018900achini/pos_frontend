import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

// ✅ Helper for clean error extraction
const getErrorMessage = (err, fallback = "Request failed") => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};

// ✅ SIGNUP
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", userData);
      const data = res.data?.data;

      console.log("✅ Signup success:", data);

      // ✅ Save JWT consistently
      if (data?.jwt) {
        localStorage.setItem("jwt", data.jwt);
      }

      return data;
    } catch (err) {
      console.error("❌ Signup error:", err);
      return rejectWithValue(getErrorMessage(err, "Signup failed"));
    }
  }
);

// ✅ LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    console.log("📥 Login credentials:", credentials);

    try {
      const res = await api.post("/auth/login", credentials);
      const data = res.data?.data;

      console.log("✅ Login success:", data);

      // ✅ Save JWT (correct key)
      if (data?.jwt) {
        localStorage.setItem("jwt", data.jwt);
      }

      return data;
    } catch (err) {
      console.error("❌ Login error:", err);
      return rejectWithValue(getErrorMessage(err, "Login failed"));
    }
  }
);

// ✅ FORGOT PASSWORD
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });

      console.log("✅ Forgot password success:", res.data);

      return res.data?.data || res.data;
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      return rejectWithValue(getErrorMessage(err, "Failed to send reset email"));
    }
  }
);

// ✅ RESET PASSWORD
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });

      console.log("✅ Reset password success:", res.data);

      return res.data?.data || res.data;
    } catch (err) {
      console.error("❌ Reset password error:", err);
      return rejectWithValue(getErrorMessage(err, "Failed to reset password"));
    }
  }
);
