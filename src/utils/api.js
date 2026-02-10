// src/utils/api.js
import axios from "axios";
import { settings } from "../constant";

const api = axios.create({
  baseURL: settings?.url+"/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem("jwt");

    // ❌ Skip auth endpoints
    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/signup") ||
      config.url?.includes("/auth/forgot-password") ||
      config.url?.includes("/auth/reset-password");

    if (rawToken && !isAuthRoute) {
      const token = rawToken.replace(/^Bearer\s+/i, "").trim();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("JWT expired or invalid. Logging out.");

      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];

      // optional redirect
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);


export default api;
