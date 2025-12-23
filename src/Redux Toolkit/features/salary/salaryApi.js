// src/Redux Toolkit/features/salary/salaryApi.js
import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const salaryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalaryByEmployee: builder.query({
      query: (employeeId) => `/employee-salaries/employee/${employeeId}`,
      providesTags: ["Salary"],
    }),
    saveSalary: builder.mutation({
      query: (salary) => ({
        url: "/employee-salaries",
        method: "POST",
        body: salary,
      }),
      invalidatesTags: ["Salary"],
    }),
  }),
});

export const { useGetSalaryByEmployeeQuery, useSaveSalaryMutation } = salaryApi;
