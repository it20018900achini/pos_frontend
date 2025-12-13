import { apiSlice } from "../../api/apiSlice";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: () => "/customers",
      providesTags: ["Customer"],
    }),
    // ✅ GET CUSTOMER BY ID
    getCustomerById: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [
        { type: "Customer", id },
      ],
    }),

    // Create new customer
    createCustomer: builder.mutation({
      query: (payload) => ({
        url: "/customers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Customer"], // refresh customer list
    }),
    // ✅ UPDATE CUSTOMER
    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Customer", id },
        { type: "CustomerSummary", id }, // 🔥 IMPORTANT
        "Customer",
      ],
    }),
  }),
});

export const {
    useGetAllCustomersQuery,
  useCreateCustomerMutation,

  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} = customerApi;
