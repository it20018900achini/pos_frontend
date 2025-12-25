import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const expenseCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all expense categories
    getExpenseCategories: builder.query({
      query: () => "/expense-categories",
      providesTags: ["ExpenseCategory"],
    }),

    // Create a new category
    createExpenseCategory: builder.mutation({
      query: (data) => ({
        url: "/expense-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ExpenseCategory"],
    }),

    // Update category
    updateExpenseCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/expense-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ExpenseCategory"],
    }),

    // Delete category
    deleteExpenseCategory: builder.mutation({
      query: (id) => ({
        url: `/expense-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExpenseCategory"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetExpenseCategoriesQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;
