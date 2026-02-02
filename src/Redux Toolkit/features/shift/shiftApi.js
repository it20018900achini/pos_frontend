import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const shiftApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
startShift: builder.mutation({
  query: ({ branchId, openingCash,openingCoins }) => ({
    url: "/shifts/start",
    method: "POST",
        body: { branchId, openingCash,openingCoins },  // <-- MUST be body, not params

  }),
  invalidatesTags: ["Shift"],
}),

    endShift: builder.mutation({
      query: ({ actualCash }) => ({
        url: `/shifts/end`,
        method: "POST",
        body: { actualCash },
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
