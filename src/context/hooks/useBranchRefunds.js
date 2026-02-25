"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentRefundsByBranchPagin } from "@/Redux Toolkit/features/refund/refundThunks";

export const useBranchRefunds = (externalBranchId) => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.user);
  const { refunds, pageInfo, loading, error } = useSelector(
    (state) => state.refund
  );

  // ---------------- Branch Resolution ----------------
  const effectiveBranchId =
    userProfile?.user?.branch?.id || externalBranchId;

  // ---------------- Local State ----------------
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  // ---------------- Fetch Function ----------------
  const fetchRefunds = useCallback(
    (start = startDate, end = endDate, search = searchText) => {
      if (!effectiveBranchId) return;

      const startISO = start
        ? new Date(start).toISOString()
        : undefined;
      const endISO = end
        ? new Date(end).toISOString()
        : undefined;

      dispatch(
        getRecentRefundsByBranchPagin({
          branchId: effectiveBranchId,
          page,
          size,
          sort: "id,desc",
          start: startISO,
          end: endISO,
          search: search || undefined,
        })
      );
    },
    [dispatch, effectiveBranchId, page, size, startDate, endDate, searchText]
  );

  // ---------------- Auto Load ----------------
  useEffect(() => {
    if (effectiveBranchId) {
      fetchRefunds();
    }
  }, [effectiveBranchId, page, size]);

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