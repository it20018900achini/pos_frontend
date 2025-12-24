// src/Redux Toolkit/features/expenseCategory/expenseCategoryApi.js
import { apiSlice } from "../../api/apiSlice";

export const expenseCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseCategories: builder.query({
      query: ({ search = "", page = 0, size = 10 }) => ({
        url: "/expense-categories",
        params: { search, page, size },
      }),
      providesTags: ["ExpenseCategory"],
    }),

    createExpenseCategory: builder.mutation({
      query: (body) => ({
        url: "/expense-categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ExpenseCategory"],
    }),

    deleteExpenseCategory: builder.mutation({
      query: (id) => ({
        url: `/expense-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExpenseCategory"],
    }),
  }),
});

export const {
  useGetExpenseCategoriesQuery,
  useCreateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;
