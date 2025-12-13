import { apiSlice } from "../../api/apiSlice";

export const customerSummaryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerSummaryById: builder.query({
      query: (id) => `/api/customers/summary/${id}`,
      providesTags: (result, error, id) => [
        { type: "CustomerSummary", id },
      ],
    }),
  }),
});

export const {
  useGetCustomerSummaryByIdQuery,
} = customerSummaryApi;
