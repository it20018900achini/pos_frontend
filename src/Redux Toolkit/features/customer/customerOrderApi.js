// src/Redux Toolkit/features/customer/customerOrders/customerOrderApi.js
import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const customerOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerOrders: builder.query({
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

        return `/orders/customer/t/${customerId}?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map((r) => ({ type: "CustomerOrder", id: r.id })),
              { type: "CustomerOrder", id: "LIST" },
            ]
          : [{ type: "CustomerOrder", id: "LIST" }],
    }),
  }),
});

export const { useGetCustomerOrdersQuery } = customerOrderApi;
