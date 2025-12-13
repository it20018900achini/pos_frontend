// src/Redux Toolkit/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper to get JWT token
const getAuthToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No JWT token found");
  return token;
};

// Base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    try {
      const token = getAuthToken();
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
    } catch (error) {
      console.warn(error.message);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Product", "Customer", "Order","CustomerPayments","CustomerRefunds","Refund"],
  endpoints: () => ({}), // Will inject endpoints later
});
