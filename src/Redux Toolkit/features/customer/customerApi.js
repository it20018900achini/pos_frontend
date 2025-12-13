import { apiSlice } from "../../api/apiSlice";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET CUSTOMER BY ID
    getCustomerById: builder.query({
      query: (id) => `/api/customers/${id}`,
      providesTags: (result, error, id) => [
        { type: "Customer", id },
      ],
    }),

    // ✅ UPDATE CUSTOMER
    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Customer", id },
        { type: "CustomerSummary", id }, // 🔥 IMPORTANT
      ],
    }),
  }),
});

export const {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} = customerApi;
