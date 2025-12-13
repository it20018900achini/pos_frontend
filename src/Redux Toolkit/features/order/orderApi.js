import { apiSlice } from "../../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/api/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
