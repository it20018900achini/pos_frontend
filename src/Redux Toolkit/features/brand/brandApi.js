// src/Redux Toolkit/features/brand/brandApi.js
import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
  getBrandsByStore: builder.query({
  query: ({ storeId, page = 0, size = 10 }) =>
    `/brands/store/${storeId}?page=${page}&size=${size}`,
  providesTags: ["Brand"],
  transformResponse: (response) => ({
    brands: response.content || [], // <--- map content to brands
    pagination: {
      pageNumber: response.pageable?.pageNumber || 0,
      pageSize: response.pageable?.pageSize || 10,
      totalPages: response.totalPages || 1,
      totalElements: response.totalElements || 0,
      first: response.first,
      last: response.last,
    },
  }),
}),
    createBrand: builder.mutation({
      query: (dto) => ({
        url: "/brands",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation({
      query: ({ id, dto }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBrandsByStoreQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
