// src/Redux Toolkit/features/quotation/quotationApi.js
import { apiSlice } from "../../api/apiSlice";

export const quotationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createQuotation: builder.mutation({
  query: (body) => ({
    url: "/quotations",
    method: "POST",
    body,
  }),
  invalidatesTags: ["Quotation"],
}),

    getQuotations: builder.query({
      query: () => "/quotations",
      providesTags: ["Quotation"],
    }),

    getQuotationById: builder.query({
      query: (id) => `/quotations/${id}`,
    }),
  }),
});

export const {
  useCreateQuotationMutation,
  useGetQuotationsQuery,
  useGetQuotationByIdQuery,
} = quotationApi;
