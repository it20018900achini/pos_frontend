import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem("jwt");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: [
    "Order",
    "Customer",
    "Product",
    "User"
  ],

  endpoints: () => ({}),
});
