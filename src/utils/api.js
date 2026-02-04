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

    if (rawToken) {
      const token = rawToken
        .replace(/^Bearer\s+/i, "")
        .replace(/\s+/g, "")
        .trim();

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
