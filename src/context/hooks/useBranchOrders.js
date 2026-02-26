import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { getRecentOrdersByBranchPagin } from "@/Redux Toolkit/features/order/orderThunks";

export const useBranchOrders = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { userProfile } = useSelector((state) => state.user);
  const { orders, pageInfo, loading, error } = useSelector(
    (state) => state.order
  );

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  // ✅ Auto-set branch for cashier or assigned users
  useEffect(() => {
    if (userProfile?.user?.branch?.id) {
      setSelectedBranchId(userProfile.user.branch.id);
    }
  }, [userProfile]);

  // ✅ Core loader
  const loadOrders = useCallback(
    (start = startDate, end = endDate, search = searchText) => {
      if (!userProfile?.user?.id) return;

      const branchToUse =
        userProfile?.user?.defaultBranch?.id || selectedBranchId;

      if (!branchToUse) {
        toast({
          title: "Branch Required",
          description: "Please select a branch first",
          variant: "destructive",
        });
        return;
      }

      const startISO = start ? new Date(start).toISOString() : undefined;
      const endISO = end ? new Date(end).toISOString() : undefined;

      dispatch(
        getRecentOrdersByBranchPagin({
          branchId: branchToUse,
          page,
          size,
          sort: "id,desc",
          start: startISO,
          end: endISO,
          search: search || undefined,
        })
      );
    },
    [
      dispatch,
      page,
      size,
      startDate,
      endDate,
      searchText,
      selectedBranchId,
      userProfile,
      toast,
    ]
  );

  // ✅ Auto load when ready
  useEffect(() => {
    if (selectedBranchId || userProfile?.user?.branch?.id) {
      loadOrders();
    }
  }, [userProfile, page, size, selectedBranchId]);

  // ✅ Error toast
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

    // branch
    selectedBranchId,
    setSelectedBranchId,

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

    // actions
    loadOrders,
  };
};