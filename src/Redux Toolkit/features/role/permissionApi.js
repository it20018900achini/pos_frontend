// src/Redux Toolkit/api/permissionApi.js
import { apiSlice } from "./apiSlice";

export const permissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: () => "/permissions",
      providesTags: ["Permission"],
    }),
  }),
});

export const { useGetPermissionsQuery } = permissionApi;
