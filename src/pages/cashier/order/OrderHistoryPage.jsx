import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, SearchIcon } from "lucide-react";
import POSHeader from "../components/POSHeader";
import OrderTable from "./OrderTable";
import RefundModal from "./RefundModal";
import { useToast } from "@/components/ui/use-toast";
import { setCurrentOrder } from "@/Redux Toolkit/features/order/orderSlice";
import { useGetOrdersByCashierQuery } from "@/Redux Toolkit/features/order/orderApi";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading, error, refetch } = useGetOrdersByCashierQuery(
    {
      cashierId: userProfile?.user.id,
      page,
      size,
      sort: "id,desc",
      start: startDate ? new Date(startDate).toISOString() : undefined,
      end: endDate ? new Date(endDate).toISOString() : undefined,
      search: searchText || undefined,
    },
    { skip: !userProfile?.user.id }
  );

  const orders = data?.orders || [];
  const pageInfo = data?.pageInfo || null;

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading orders",
        description: error?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleViewOrder = (order) => {
    dispatch(setCurrentOrder(order));
  };

  const handleRefundOrder = (order) => {
    dispatch(setCurrentOrder(order));
    setShowRefundModal(true);
  };

  const handleRefundSubmit = (updatedOrder) => {
    dispatch(setCurrentOrder(updatedOrder));
    setShowRefundModal(false);
    toast({ title: "Refund processed successfully" });
  };

  const handleRefresh = () => {
    refetch();
    toast({ title: "Refreshing orders..." });
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchText("");
    setPage(0);
  };

  const nextPage = () => {
    if (pageInfo && page < pageInfo.totalPages - 1) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(p => p - 1);
  };

  const selectedOrder = useSelector(state => state.order.selectedOrder);

  return (
    <div className="h-full flex flex-col">
      <POSHeader />

      {/* Header */}
      <div className="p-4 bg-card border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order History</h1>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading && "animate-spin"}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="p-4 flex gap-2 flex-wrap">
        <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-1" />
        <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-1" />
        <input type="text" placeholder="Search by ID or Customer" value={searchText} onChange={e => setSearchText(e.target.value)} className="border p-1" />
        <select value={size} onChange={e => setSize(Number(e.target.value))} className="border p-1">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <Button size="sm" onClick={() => refetch()}>Filter</Button>
        <Button size="sm" variant="outline" onClick={resetFilters}>Reset</Button>
      </div>

      {/* Orders Table */}
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="animate-spin h-12 w-12" />
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : orders.length ? (
          <>
            <OrderTable
              orders={orders}
              handleViewOrder={handleViewOrder}
              handleRefundOrder={handleRefundOrder}
            />

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevPage} disabled={page === 0}>Prev</Button>
              <span>Page {page + 1} of {pageInfo?.totalPages || 1}</span>
              <Button variant="outline" onClick={nextPage} disabled={pageInfo?.last}>Next</Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <SearchIcon size={40} />
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {selectedOrder && (
        <RefundModal
          open={showRefundModal}
          order={selectedOrder}
          onClose={() => setShowRefundModal(false)}
          onSubmit={handleRefundSubmit}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;
