// src/Redux Toolkit/features/payroll/payrollApi.js
import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const payrollApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch payrolls for a branch by year and month
    getBranchPayrolls: builder.query({
      query: ({ branchId, year, month }) =>
        `/payrolls/branch/${branchId}?year=${year}&month=${month}`,
      providesTags: ["Payroll"],
    }),

    // ✅ Generate payroll for an employee
    generatePayroll: builder.mutation({
      query: ({ employeeId, year, month }) => ({
        url: `/payrolls/generate?employeeId=${employeeId}&year=${year}&month=${month}`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),

    // ✅ Approve a payroll
    approvePayroll: builder.mutation({
      query: (payrollId) => ({
        url: `/payrolls/${payrollId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),

    // ✅ Mark payroll as PAID
    markPayrollPaid: builder.mutation({
      query: ({ payrollId, reference }) => ({
        url: `/payrolls/${payrollId}/pay${reference ? `?reference=${reference}` : ""}`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),


    getPayrollStatsByBranch: builder.query({
      query: ({ branchId, year, month }) => ({
        url: `/payrolls/branch/${branchId}/stats`,
        params: { year, month },
      }),
    }),

  }),
});

export const {
  useGetPayrollStatsByBranchQuery,
  useGetBranchPayrollsQuery,
  useGeneratePayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
} = payrollApi;
