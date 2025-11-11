import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import { SearchIcon, Loader2, RefreshCw, Download, PrinterIcon } from "lucide-react";

import POSHeader from "../components/POSHeader";
import OrderTable from "./OrderTable";
import OrderDetails from "./OrderDetails/OrderDetails";

import { getOrdersByCashier } from "@/Redux Toolkit/features/order/orderThunks";
import { handleDownloadOrderPDF } from "./pdf/pdfUtils";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { userProfile } = useSelector((state) => state.user);
  const { orders, pageInfo, loading, error } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Fetch orders
  const loadOrders = () => {
    if (!userProfile?.id) return;

    dispatch(
      getOrdersByCashier({
        cashierId: userProfile.id,
        page,
        size,
        sort: "id,desc",
      })
    );
  };

  useEffect(() => {
    loadOrders();
  }, [userProfile, page, size]);

  // Show errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Orders",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  // Handlers
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  const handlePrintInvoice = (order) => {
    toast({
      title: "Print Invoice",
      description: `Invoice for order ${order.id} sent to printer.`,
    });
  };

  const handleDownloadPDF = async () => {
    await handleDownloadOrderPDF(selectedOrder, toast);
  };

  const handleRefreshOrders = () => {
    loadOrders();
    toast({
      title: "Refreshing Orders",
      description: "Please wait...",
    });
  };

  const handleInitiateReturn = (order) => {
    toast({
      title: "Initiate Return",
      description: `Return process started for order ${order.id}.`,
    });
  };

  // Pagination
  const nextPage = () => {
    if (pageInfo && page < pageInfo.totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="h-full flex flex-col">
      <POSHeader />

      {/* Page Header */}
      <div className="p-4 bg-card border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order History</h1>
        <Button variant="outline" onClick={handleRefreshOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Loader2 className="animate-spin h-16 w-16 text-primary" />
            <p className="mt-4">Loading orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <>
            {/* Pagination */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">
                Page {pageInfo?.page + 1} of {pageInfo?.totalPages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page === 0 || loading} onClick={prevPage}>
                  Prev
                </Button>
                <Button
                  variant="outline"
                  disabled={pageInfo?.page === pageInfo?.totalPages - 1 || loading}
                  onClick={nextPage}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Orders Table */}
            <OrderTable
              orders={orders}
              handleViewOrder={handleViewOrder}
              handlePrintInvoice={handlePrintInvoice}
              handleInitiateReturn={handleInitiateReturn}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <SearchIcon size={48} strokeWidth={1} />
            <p className="mt-4">No orders found</p>
            <p className="text-sm">Try refreshing</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        {selectedOrder && (
          <DialogContent className="bg-white max-h-screen overflow-y-scroll max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Order Details - Invoice</DialogTitle>
            </DialogHeader>

            <OrderDetails selectedOrder={selectedOrder} />

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>

              <Button onClick={() => handlePrintInvoice(selectedOrder)}>
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

export default OrderHistoryPage;
