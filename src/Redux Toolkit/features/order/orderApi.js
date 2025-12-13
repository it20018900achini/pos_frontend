import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getOrdersByCashier: builder.query({
      query: ({ cashierId, page, size, sort, start, end, search }) => ({
        url: `/orders/cashier/${cashierId}`,
        params: {
          page,
          size,
          sort,
          start,
          end,
          search,
        },
      }),

      // 🔥 THIS IS THE KEY FIX
      transformResponse: (response) => ({
        orders: response.content || [],
        pageInfo: {
          pageNumber: response.number ?? 0,
          pageSize: response.size ?? 10,
          totalPages: response.totalPages ?? 0,
          totalElements: response.totalElements ?? 0,
          first: response.first ?? false,
          last: response.last ?? false,
        },
      }),

      providesTags: (result) =>
        result?.orders?.length
          ? [
              ...result.orders.map((order) => ({
                type: "Order",
                id: order.id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetOrdersByCashierQuery,
} = orderApi;
