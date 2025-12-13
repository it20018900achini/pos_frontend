import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import {
  SearchIcon,
  Loader2,
  RefreshCw,
  Download,
  PrinterIcon,
} from "lucide-react";

import POSHeader from "../components/POSHeader";
import OrderTable from "./OrderTable";
import OrderDetails from "./OrderDetails/OrderDetails";
import CompareItems from "./CompareItems";

import { handleDownloadOrderPDF } from "./pdf/pdfUtils";

import {
  useGetOrdersByCashierQuery,
} from "@/Redux Toolkit/features/order/orderApi";

const OrderHistoryPage = () => {
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);

  /* -------------------- UI STATE -------------------- */
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderReturn, setSelectedOrderReturn] = useState(null);

  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [showOrderReturnDetailsDialog, setShowOrderReturnDetailsDialog] =
    useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  /* -------------------- RTK QUERY -------------------- */
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetOrdersByCashierQuery(
    {
      cashierId: userProfile?.id,
      page,
      size,
      sort: "id,desc",
      start: startDate ? new Date(startDate).toISOString() : undefined,
      end: endDate ? new Date(endDate).toISOString() : undefined,
      search: searchText || undefined,
    },
    { skip: !userProfile?.id }
  );

  const orders = data?.orders || [];
  const pageInfo = data?.pageInfo || null;

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading orders",
        description: error?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [error]);

  /* -------------------- HANDLERS -------------------- */
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  const handleReturnOrder = (order) => {
    setSelectedOrderReturn(order);
    setShowOrderReturnDetailsDialog(true);
  };

  const handleRefreshOrders = () => {
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
    if (pageInfo && page < pageInfo.totalPages - 1) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleDownloadPDF = async () => {
    if (selectedOrder) {
      await handleDownloadOrderPDF(selectedOrder, toast);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="h-full flex flex-col">
      <POSHeader />

      {/* Header */}
      <div className="p-4 bg-card border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order History</h1>
        <Button variant="outline" onClick={handleRefreshOrders}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading && "animate-spin"}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="p-4 flex gap-2 flex-wrap">
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-1"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-1"
        />
        <input
          type="text"
          placeholder="Search by ID or Customer"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-1"
        />
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <Button size="sm" onClick={() => refetch()}>
          Filter
        </Button>
        <Button size="sm" variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {/* Content */}
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
              handleReturnOrder={handleReturnOrder}
            />

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevPage} disabled={page === 0}>
                Prev
              </Button>
              <span>
                Page {page + 1} of {pageInfo?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={pageInfo?.last}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <SearchIcon size={40} />
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        {selectedOrder && (
          <DialogContent className="max-w-[80%]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>

            <OrderDetails selectedOrder={selectedOrder} />

            <DialogFooter>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button>
                <PrinterIcon className="mr-2 h-4 w-4" />
                Print
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Refund Dialog */}
      <Dialog
        open={showOrderReturnDetailsDialog}
        onOpenChange={setShowOrderReturnDetailsDialog}
      >
        {selectedOrderReturn && (
          <DialogContent className="max-w-[80%]">
            <DialogHeader>
              <DialogTitle>Refund Details</DialogTitle>
            </DialogHeader>

            <CompareItems dataSelected={selectedOrderReturn} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OrderHistoryPage;
