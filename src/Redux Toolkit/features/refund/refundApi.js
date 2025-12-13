// src/Redux Toolkit/features/refund/refundApi.js
import { apiSlice } from "../../api/apiSlice"; // your base apiSlice

export const refundApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new refund
    createRefund: builder.mutation({
      query: (refundData) => ({
        url: "/refunds",
        method: "POST",
        body: refundData,
      }),
    //   invalidatesTags: ["Refund"],
    

      // 🔥 THIS IS THE MAGIC
      invalidatesTags: [
        { type: "Refund", id: "LIST" },
        { type: "Order", id: "LIST" },
      ],
    

    }),

    // Optionally, get all refunds (for listing)
    getRefunds: builder.query({
      query: () => ({
        url: "/refunds",
        method: "GET",
      }),
      providesTags: ["Refund"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateRefundMutation, useGetRefundsQuery } = refundApi;
