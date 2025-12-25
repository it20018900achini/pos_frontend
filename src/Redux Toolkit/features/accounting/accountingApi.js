// src/Redux Toolkit/features/accounting/accountingApi.js
import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const accountingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Chart of Accounts
    getChartOfAccounts: builder.query({
      query: () => "/accounting/coa",
      providesTags: ["ChartOfAccount"],
    }),
    createChartOfAccount: builder.mutation({
      query: (data) => ({ url: "/accounting/coa", method: "POST", body: data }),
      invalidatesTags: ["ChartOfAccount"],
    }),

    // Expenses
    getExpenses: builder.query({
      query: () => "/expenses",
      providesTags: ["Expense"],
    }),
    createExpense: builder.mutation({
      query: (data) => ({ url: "/expenses", method: "POST", body: data }),
      invalidatesTags: ["Expense"],
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/expenses/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Expense"],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({ url: `/expenses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Expense"],
    }),

    // Accounting Reports
    getTrialBalance: builder.query({
      query: () => "/accounting/reports/trial-balance",
    }),
    getProfitLoss: builder.query({
      query: () => "/accounting/reports/profit-loss",
    }),
    getBalanceSheet: builder.query({
      query: () => "/accounting/reports/balance-sheet",
    }),

    // ✅ Expenses per Category for Dashboard
    getTotalExpensesPerCategory: builder.query({
      query: () => "/accounting/reports/expenses-by-category",
    }),

    // ✅ Expense Report by Date Range
    getExpenseReport: builder.query({
      query: ({ from, to }) => `/accounting/reports/expense?from=${from}&to=${to}`,
      providesTags: ["Expense"],
    }),


    updateChartOfAccount: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/accounting/coa/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ChartOfAccount"],
    }),


   getJournals: builder.query({
      query: () => "/accounting/journals",
      providesTags: ["Journal"],
    }),
    createJournal: builder.mutation({
      query: (journal) => ({
        url: "/accounting/journals",
        method: "POST",
        body: journal,
      }),
      invalidatesTags: ["Journal"],
    }),
    updateJournal: builder.mutation({
      query: ({ id, ...journal }) => ({
        url: `/accounting/journals/${id}`,
        method: "PUT",
        body: journal,
      }),
      invalidatesTags: ["Journal"],
    }),
    deleteJournal: builder.mutation({
      query: (id) => ({
        url: `/accounting/journals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Journal"],
    }),



    
  }),
  overrideExisting: false,
});

export const {
    useGetJournalsQuery,
  useCreateJournalMutation,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
  useUpdateChartOfAccountMutation,
  useGetChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetTrialBalanceQuery,
  useGetProfitLossQuery,
  useGetBalanceSheetQuery,
  useGetTotalExpensesPerCategoryQuery,
  useGetExpenseReportQuery, // ✅ New hook for date range
} = accountingApi;
