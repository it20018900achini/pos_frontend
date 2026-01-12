// src/Redux Toolkit/features/product/productApi.js
import { apiSlice } from "../../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductVariantsByStore: builder.query({
      query: (storeId) => `/products/store/${storeId}/variants`,
      providesTags: ["Product"],
    }),
    getProductsByStore: builder.query({
      query: (storeId) => `/products/store/${storeId}`,
      providesTags: ["Product"],
    }),
    searchProducts: builder.query({
      query: ({ storeId, query }) =>
        `/products/store/${storeId}/variants/search?q=${encodeURIComponent(query)}`,
      providesTags: ["Product"],
    }),
  }),
});

export const { usegetProductVariantsByStoreQuery, useSearchProductsQuery } = productApi;
