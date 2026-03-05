// src/Redux Toolkit/features/accounting/accountingApi.js
import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const accountingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ===== Chart of Accounts =====
    getChartOfAccounts: builder.query({
  query: (storeId) => `/accounting/coa/store/${storeId}`,
  providesTags: ["COA"],
}),
    createChartOfAccount: builder.mutation({
      query: (account) => ({ url: "/accounting/coa", method: "POST", body: account }),
      invalidatesTags: ["COA"],
    }),
    updateChartOfAccount: builder.mutation({
      query: ({ id, ...account }) => ({ url: `/accounting/coa/${id}`, method: "PUT", body: account }),
      invalidatesTags: ["COA"],
    }),
    deleteChartOfAccount: builder.mutation({
      query: (id) => ({ url: `/accounting/coa/${id}`, method: "DELETE" }),
      invalidatesTags: ["COA"],
    }),

    // ===== Journals =====
getJournals: builder.query({
  // Accept query params
  query: ({ entryId, from, to, page = 0, size = 10 } = {}) => {
    const params = new URLSearchParams();
    if (entryId) params.append("entryId", entryId);
    if (from) params.append("from", from);   // ISO string e.g., "2026-01-01T00:00:00"
    if (to) params.append("to", to);         // ISO string e.g., "2026-01-31T23:59:59"
    params.append("page", page);
    params.append("size", size);
    return `/accounting/journals?${params.toString()}`;
  },
  providesTags: ["Journal"],
}),

createJournal: builder.mutation({
  query: ({ branchId, ...journal }) => ({
    url: `/accounting/journals?branchId=${branchId}`,
    method: "POST",
    body: journal,
  }),
  invalidatesTags: ["Journal"],
}),

    updateJournal: builder.mutation({
      query: ({ id, ...journal }) => ({ url: `/accounting/journals/${id}`, method: "PUT", body: journal }),
      invalidatesTags: ["Journal"],
    }),



    updateJournalEntry: builder.mutation({
      query: ({ id, ...journal }) => ({ url: `/accounting/journals/entry/${id}`, method: "PUT", body: journal }),
      invalidatesTags: ["Journal"],
    }),

    deleteJournal: builder.mutation({
      query: (id) => ({ url: `/accounting/journals/entry/${id}`, method: "DELETE" }),
      invalidatesTags: ["Journal"],
    }),
    postSalary: builder.mutation({
      query: ({ totalSalary, epfPercent, etfPercent }) => ({
        url: "/accounting/journals/salary",
        method: "POST",
        body: { totalSalary, epfPercent, etfPercent },
      }),
      invalidatesTags: ["Journal"],
    }),

    // ===== Expenses =====
    getExpenses: builder.query({ query: () => "/expenses", providesTags: ["Expense"] }),
    createExpense: builder.mutation({ query: (data) => ({ url: "/expenses", method: "POST", body: data }), invalidatesTags: ["Expense"] }),
    updateExpense: builder.mutation({ query: ({ id, ...data }) => ({ url: `/expenses/${id}`, method: "PUT", body: data }), invalidatesTags: ["Expense"] }),
    deleteExpense: builder.mutation({ query: (id) => ({ url: `/expenses/${id}`, method: "DELETE" }), invalidatesTags: ["Expense"] }),

    // ===== Reports =====
    getTrialBalance: builder.query({ query: () => "/accounting/reports/trial-balance" }),
getProfitLoss: builder.query({
  query: ({ start, end }) => {
    const params = new URLSearchParams({ start, end });
    return `/accounting/reports/profit-loss?${params.toString()}`;
  }
}),
getBalanceSheet: builder.query({
  query: ({ start, end }) => {
    const params = new URLSearchParams({
      start, // e.g., "2026-01-01T00:00:00"
      end,   // e.g., "2026-01-31T23:59:59"
    });
    return `/accounting/reports/balance-sheet?${params.toString()}`;
  },
}),

    
    getTotalExpensesPerCategory: builder.query({ query: () => "/accounting/reports/expenses-by-category" }),
    getExpenseReport: builder.query({
      query: ({ from, to }) => `/accounting/reports/expense?from=${from}&to=${to}`,
      providesTags: ["Expense"],
    }),

    
    // Ledger endpoint

        getLedger: builder.query({
      query: ({ accountId, page = 0, size = 5 }) =>
        `/accounting/journals/account/${accountId}?page=${page}&size=${size}`,
      providesTags: ["Ledger"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLedgerQuery,
    useLazyGetLedgerQuery,  // for manual trigger

  // COA
  useGetChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
  useUpdateChartOfAccountMutation,
  useDeleteChartOfAccountMutation,
  // Journals
  useGetJournalsQuery,
  useCreateJournalMutation,
  useUpdateJournalMutation,

  useUpdateJournalEntryMutation,
  useDeleteJournalMutation,
  usePostSalaryMutation,
  // Expenses
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  // Reports
  useGetTrialBalanceQuery,
  useGetProfitLossQuery,
  useGetBalanceSheetQuery,
  useGetTotalExpensesPerCategoryQuery,
  useGetExpenseReportQuery,
} = accountingApi;
