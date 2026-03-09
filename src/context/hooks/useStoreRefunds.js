"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentRefundsByStorePagin } from "@/Redux Toolkit/features/refund/refundThunks";

export const useStoreRefunds = (externalStoreId) => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.user);
  const { refunds, pageInfo, loading, error } = useSelector(
    (state) => state.refund
  );

  // ---------------- Store Resolution ----------------
  const effectiveStoreId =
    userProfile?.user?.branch?.id || externalStoreId;

  // ---------------- Local State ----------------
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  // ---------------- Fetch Function ----------------
  const fetchRefunds = useCallback(
    (start = startDate, end = endDate, search = searchText) => {
      if (!effectiveStoreId) return;

      const startISO = start
        ? new Date(start).toISOString()
        : undefined;
      const endISO = end
        ? new Date(end).toISOString()
        : undefined;

      dispatch(
        getRecentRefundsByStorePagin({
          storeId: userProfile?.user?.store?.id,
          page,
          size,
          sort: "id,desc",
          start: startISO,
          end: endISO,
          search: search || undefined,
        })
      );
    },
    [dispatch, userProfile, page, size, startDate, endDate, searchText]
  );

  // ---------------- Auto Load ----------------
  useEffect(() => {
    if (userProfile?.user?.store?.id) {
      fetchRefunds();
    }
  }, [userProfile, page, size]);

  // ---------------- Reset ----------------
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchText("");
    setPage(0);
    fetchRefunds("", "", "");
  };

  return {
    refunds,
    pageInfo,
    loading,
    error,

    page,
    setPage,
    size,
    setSize,

    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchText,
    setSearchText,

    fetchRefunds,
    resetFilters,
  };
};