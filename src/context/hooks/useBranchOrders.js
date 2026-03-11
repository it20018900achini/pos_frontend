import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { getRecentOrdersByBranchPagin } from "@/Redux Toolkit/features/order/orderThunks";
export const useBranchOrders = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const { orders, pageInfo, loading, error } = useSelector((state) => state.order);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  const branchId = selectedBranchId || userProfile?.user?.branch?.id;

  const loadOrders = useCallback(() => {
    if (!branchId) return;

    dispatch(
      getRecentOrdersByBranchPagin({
        branchId,
        page,
        size,
        sort: "id,desc",
        start: startDate ? new Date(startDate).toISOString() : undefined,
        end: endDate ? new Date(endDate).toISOString() : undefined,
        search: searchText || undefined,
      })
    );
  }, [dispatch, branchId, page, size, startDate, endDate, searchText]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

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
    orders,
    pageInfo,
    loading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchText,
    setSearchText,
    page,
    setPage,
    size,
    setSize,
    loadOrders,
  };
};