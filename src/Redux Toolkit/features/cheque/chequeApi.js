// src/Redux Toolkit/features/cheque/chequeApi.js
import { apiSlice } from "../../api/apiSlice";

export const chequeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCheques: builder.query({
      query: ({ branchId, type, status, startDate, endDate }) => {
        let params = new URLSearchParams();
        if (branchId) params.append("branchId", branchId);
        if (type) params.append("type", type);
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `/cheques?${params.toString()}`;
      },
      providesTags: ["Cheque"],
    }),
    createCheque: builder.mutation({
      query: (data) => ({
        url: "/cheques",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cheque"],
    }),
    updateCheque: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/cheques/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cheque"],
    }),
    deleteCheque: builder.mutation({
      query: (id) => ({
        url: `/cheques/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cheque"],
    }),
  }),
});

export const {
  useGetChequesQuery,
  useCreateChequeMutation,
  useUpdateChequeMutation,
  useDeleteChequeMutation,
} = chequeApi;
