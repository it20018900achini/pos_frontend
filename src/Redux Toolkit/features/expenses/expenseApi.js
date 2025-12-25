import { apiSlice } from "../../api/apiSlice";

export const expenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: ({ search, branchId, categoryId, page, size }) => ({
        url: `/expenses`,
        params: { search, branchId, categoryId, page, size },
      }),
      providesTags: ["Expense"],
    }),
    createExpense: builder.mutation({
      query: (expense) => ({
        url: `/expenses`,
        method: "POST",
        body: expense,
      }),
      invalidatesTags: ["Expense"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetExpensesQuery, useCreateExpenseMutation } = expenseApi;
