// src/Redux Toolkit/features/customer/customerRefunds/customerRefundApi.js

import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const customerRefundApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerRefunds: builder.query({
      query: ({
        customerId,
        page = 0,
        size = 10,
        sortBy = "createdAt",
        sortDir = "desc",
        status,
        startDate,
        endDate,
      }) => {
        const params = new URLSearchParams({ page, size, sortBy, sortDir });
        if (status) params.append("status", status);
        if (startDate) params.append("start", new Date(startDate).toISOString());
        if (endDate) params.append("end", new Date(endDate).toISOString());

        return `/refunds/customer/t/${customerId}?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map((r) => ({ type: "CustomerRefund", id: r.id })),
              { type: "CustomerRefund", id: "LIST" },
            ]
          : [{ type: "CustomerRefund", id: "LIST" }],
    }),
  }),
});

export const { useGetCustomerRefundsQuery } = customerRefundApi;
