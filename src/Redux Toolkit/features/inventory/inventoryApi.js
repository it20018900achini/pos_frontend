// src/features/inventory/inventoryApi.js
import { apiSlice } from "../../api/apiSlice";

export const inventoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoriesByBranch: builder.query({
      query: (branchId) => `/inventories/branch/${branchId}`,
      providesTags: ["Inventory"],
    }),
    getInventoryById: builder.query({
      query: (id) => `/inventories/${id}`,
      providesTags: ["Inventory"],
    }),
    createInventory: builder.mutation({
      query: (body) => ({
        url: `/inventories`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),
    updateInventory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),
    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `/inventories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useGetInventoriesByBranchQuery,
  useGetInventoryByIdQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = inventoryApi;
