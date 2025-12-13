import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const customerPaymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ customerId, page = 0, size = 10, sortBy = "createdAt", sortDir = "desc", status, startDate, endDate }) => {
        const params = new URLSearchParams({ page, size, sortBy, sortDir });
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return `/customer-payments/filter?customerId=${customerId}&${params.toString()}`;
      },
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map(({ id }) => ({ type: "CustomerPayment", id })),
              { type: "CustomerPayment", id: "LIST" },
            ]
          : [{ type: "CustomerPayment", id: "LIST" }],
    }),

    createPayment: builder.mutation({
      query: (payment) => ({
        url: "/customer-payments",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: [{ type: "CustomerPayment", id: "LIST" }],
    }),

    updatePayment: builder.mutation({
      query: ({ id, payment }) => ({
        url: `/customer-payments/${id}`,
        method: "PUT",
        body: payment,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "CustomerPayment", id }],
    }),

    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/customer-payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CustomerPayment", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = customerPaymentApi;
