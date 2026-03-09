import { apiSlice } from "../../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1️⃣ Get all variants by store (existing)
    GetProductVariantsByBranch: builder.query({
      query: (branchId) => `/products/branch/${branchId}/variants`,
      providesTags: ["Product"],
    }),

    // 2️⃣ Get all products by store (existing)
    getProductsByStore: builder.query({
      query: (storeId) => `/products/store/${storeId}`,
      providesTags: ["Product"],
    }),

    // 3️⃣ Search products by query (existing)
    searchProducts: builder.query({
      query: ({ storeId, query }) =>
        `/products/store/${storeId}/variants/search?q=${encodeURIComponent(query)}`,
      providesTags: ["Product"],
    }),

    // 4️⃣ Filter variants (new endpoint)
    filterProductVariants: builder.query({
      query: ({
        branchId,
        keyword,
        productId,
        isActive,
        isFeatured,
        minPrice,
        maxPrice,
        page = 0,
        size = 10,
        sortBy = "id",
        sortDir = "asc",
      }) => {
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (productId) params.append("productId", productId);
        if (isActive !== undefined) params.append("isActive", isActive);
        if (isFeatured !== undefined) params.append("isFeatured", isFeatured);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        params.append("page", page);
        params.append("size", size);
        params.append("sortBy", sortBy);
        params.append("sortDir", sortDir);

        return `/variants/filter?branchId=${branchId}&${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // 5️⃣ Get variant by ID
    getProductVariantById: builder.query({
      query: (id) => `/variants/${id}`,
      providesTags: ["Product"],
    }),

    // 6️⃣ Create variant
    createProductVariant: builder.mutation({
      query: (variant) => ({
        url: `/variants`,
        method: "POST",
        body: variant,
      }),
      invalidatesTags: ["Product"],
    }),

    // 7️⃣ Update variant
    updateProductVariant: builder.mutation({
      query: ({ id, ...variant }) => ({
        url: `/variants/${id}`,
        method: "PUT",
        body: variant,
      }),
      invalidatesTags: ["Product"],
    }),

    // 8️⃣ Delete variant
    deleteProductVariant: builder.mutation({
      query: (id) => ({
        url: `/variants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductVariantsByBranchQuery,
  useGetProductsByStoreQuery,
  useSearchProductsQuery,
  useFilterProductVariantsQuery,
  useGetProductVariantByIdQuery,
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} = productApi;
