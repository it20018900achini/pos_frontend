import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import { SearchIcon, Loader2, RefreshCw, Download, PrinterIcon } from "lucide-react";

import OrderTable from "./OrderTable";
import OrderDetails from "./OrderDetails";

import { getRecentRefundsByBranchPagin } from "@/Redux Toolkit/features/refund/refundThunks";
import { handleDownloadOrderPDF } from "./pdf/pdfUtils";
import * as XLSX from "xlsx";

const RecentRefunds = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);
  const { refunds, pageInfo, loading, error } = useSelector((state) => state.refund);
  const { branch } = useSelector((state) => state.branch);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  const branchId = branch?.id;

  const loadOrders = (branchId, start = startDate, end = endDate, search = searchText) => {
    if (!userProfile?.id) return;

    const startISO = start ? new Date(start).toISOString() : undefined;
    const endISO = end ? new Date(end).toISOString() : undefined;

    dispatch(
      getRecentRefundsByBranchPagin({
        branchId,
        page,
        size,
        sort: "id,desc",
        start: startISO,
        end: endISO,
        search: search || undefined,
      })
    );
  };

  useEffect(() => {
    if (userProfile?.id && branchId) loadOrders(branchId);
  }, [userProfile, page, size, branchId]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Orders",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleViewOrder = (refund) => {
    setSelectedOrder(refund);
    setShowOrderDetailsDialog(true);
  };

  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;
    await handleDownloadOrderPDF(selectedOrder, toast);
  };

  const handleRefreshOrders = () => {
    loadOrders(branchId);
    toast({
      title: "Refreshing Orders",
      description: "Please wait...",
    });
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchText("");
    setPage(0);
    loadOrders(branchId, "", "", "");
  };

  const nextPage = () => {
    if (pageInfo && page < pageInfo.totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0B1221] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Page Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-b-lg shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-4 h-4 bg-red-600 rounded-full"></span>
          Refund History
        </h1>
      </div>

      {/* Filters */}
      <div className="p-4 md:flex gap-2 items-center flex-wrap bg-white dark:bg-[#111827] rounded-lg shadow-md mb-4">
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-1 m-1 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
          placeholder="Start Date"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-1 m-1 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
          placeholder="End Date"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-1 m-1 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
          placeholder="Search by ID or Customer"
        />
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border p-1 m-1 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <Button onClick={() => loadOrders(branchId)} disabled={loading} size="sm" className="m-1">
          Filter
        </Button>
        <Button variant="outline" onClick={resetFilters} disabled={loading} size="sm" className="m-1">
          Reset
        </Button>
      </div>

      {/* Export + Refresh */}
      <div className="flex gap-2 w-full justify-end mb-2 flex-wrap">
        <Button variant="outline" onClick={handleRefreshOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="animate-spin h-16 w-16 text-red-500 dark:text-red-400" />
            <p className="mt-4">Loading refunds...</p>
          </div>
        ) : refunds && refunds.length > 0 ? (
          <>
            <OrderTable
              refunds={refunds}
              handleViewOrder={handleViewOrder}
            />
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div className="text-sm">
                Showing {pageInfo ? page * size + 1 : 0} -{" "}
                {pageInfo ? Math.min((page + 1) * size, pageInfo.totalElements) : 0} of{" "}
                {pageInfo?.totalElements || 0} refunds
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="outline" disabled={page === 0 || loading} onClick={prevPage}>
                  Prev
                </Button>
                {pageInfo &&
                  Array.from({ length: pageInfo.totalPages }, (_, i) => i)
                    .slice(Math.max(0, page - 2), Math.min(pageInfo.totalPages, page + 3))
                    .map((i) => (
                      <Button
                        key={i}
                        variant={i === page ? "default" : "outline"}
                        onClick={() => setPage(i)}
                        disabled={loading}
                      >
                        {i + 1}
                      </Button>
                    ))}
                <Button
                  variant="outline"
                  disabled={pageInfo?.page === pageInfo?.totalPages - 1 || loading}
                  onClick={nextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <SearchIcon size={48} strokeWidth={1} />
            <p className="mt-4">No refunds found</p>
            <p className="text-sm">Try refreshing or adjusting filters</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        {selectedOrder && (
          <DialogContent className="sm:max-w-[80%] max-h-[99vh] overflow-y-auto bg-white dark:bg-[#111827] text-gray-900 dark:text-white rounded-lg">
            <DialogHeader>
              <DialogTitle>Order Refund Details - Invoice</DialogTitle>
            </DialogHeader>

            <OrderDetails selectedOrder={selectedOrder} />

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>

              <Button onClick={() => console.log("Print Invoice")}>
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default RecentRefunds;
