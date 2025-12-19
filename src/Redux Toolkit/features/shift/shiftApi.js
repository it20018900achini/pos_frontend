import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const shiftApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startShift: builder.mutation({
      query: ({ branchId, openingCash }) => ({
        url: `/shifts/start`,
        method: "POST",
        params: { branchId, openingCash },
      }),
      invalidatesTags: ["Shift"],
    }),
    endShift: builder.mutation({
      query: ({ actualCash }) => ({
        url: `/shifts/end`,
        method: "POST",
        params: { actualCash },
      }),
      invalidatesTags: ["Shift"],
    }),
    getCurrentShift: builder.query({
      query: () => `/shifts/current`,
      providesTags: ["Shift"],
    }),
    getAllShifts: builder.query({
      query: () => `/shifts`,
      providesTags: ["Shift"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useStartShiftMutation,
  useEndShiftMutation,
  useGetCurrentShiftQuery,
  useGetAllShiftsQuery,
} = shiftApi;
