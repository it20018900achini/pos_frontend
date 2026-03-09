import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { getRecentOrdersByStorePagin } from "@/Redux Toolkit/features/order/orderThunks";

export const useStoreOrders = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { userProfile } = useSelector((state) => state.user);
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

  // ✅ Compute store safely
  const storeId =userProfile?.user?.store?.id

  // ✅ Core Loader (stable)
  const loadOrders = useCallback(() => {
    if (!userProfile?.user?.id || !storeId) return;

    const startISO = startDate
      ? new Date(startDate).toISOString()
      : undefined;

    const endISO = endDate
      ? new Date(endDate).toISOString()
      : undefined;

    dispatch(
      getRecentOrdersByStorePagin({
        storeId,
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
    storeId,
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
    if (storeId) {
      loadOrders();
    }
  }, [storeId, page, size]);

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