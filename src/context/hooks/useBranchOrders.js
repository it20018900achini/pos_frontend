import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { getRecentOrdersByBranchPagin } from "@/Redux Toolkit/features/order/orderThunks";

export const useBranchOrders = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const { orders, pageInfo, loading, error } = useSelector(
    (state) => state.order
  );

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // ✅ Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  // ✅ Compute branch safely
  const branchId =selectedBranchId

  // ✅ Core Loader (stable)
  const loadOrders = useCallback(() => {
    if (!userProfile?.user?.id || !branchId) return;

    const startISO = startDate
      ? new Date(startDate).toISOString()
      : undefined;

    const endISO = endDate
      ? new Date(endDate).toISOString()
      : undefined;

    dispatch(
      getRecentOrdersByBranchPagin({
        branchId,
        page,
        size,
        sort: "id,desc",
        start: startISO,
        end: endISO,
        search: searchText || undefined,
      })
    );
  }, [
    dispatch,
    branchId,
    page,
    size,
    startDate,
    endDate,
    searchText,
    userProfile?.user?.id,
  ]);

  // ✅ Auto Load on:
  // - Page reload
  // - Pagination change
  // - User ready
  useEffect(() => {
    if (branchId) {
      loadOrders();
    }
  }, [branchId, page, size]);

  // ✅ Error Toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Orders",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return {
    // redux data
    orders,
    pageInfo,
    loading,

    // filters
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchText,
    setSearchText,

    // pagination
    page,
    setPage,
    size,
    setSize,

    // manual trigger
    loadOrders,
  };
};