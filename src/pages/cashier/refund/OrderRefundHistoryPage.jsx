"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  Loader2,
  RefreshCw,
  Download,
  PrinterIcon,
  EyeIcon,
} from "lucide-react";

import ReusableTable from "../../common/ReusableTable";
import OrderDetails from "./OrderDetails/OrderDetails";

import { getRefundsByCashier } from "@/Redux Toolkit/features/refund/refundThunks";
import { handleDownloadOrderPDF } from "./pdf/pdfUtils";
import ContentLayout from "../../Dashboard/ContentLayout";

const OrderRefundHistoryPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);
  const { refunds, pageInfo, loading, error } = useSelector((state) => state.refund);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [sort, setSort] = useState(null);

  /** Load orders based on filters */
  const loadOrders = ({ startDate, endDate, search, status, paymentType, pageSize }, page = 0) => {
    if (!userProfile?.user?.id) return;

    dispatch(
      getRefundsByCashier({
        cashierId: userProfile.user.id,
        page,
        size: pageSize,
        sort: sort ? `${sort.field},${sort.direction}` : "id,desc",
        start: startDate || undefined,
        end: endDate || undefined,
        search: search || undefined,
        status: status || undefined,
        paymentType: paymentType || undefined,
      })
    );
  };

  useEffect(() => {
    if (userProfile?.user?.id) loadOrders({ pageSize: 10 });
  }, [userProfile, sort]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Refunds",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  /** Table actions */
  const handleViewOrder = (refund) => {
    setSelectedOrder(refund);
    setShowOrderDetailsDialog(true);
  };

  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;
    await handleDownloadOrderPDF(selectedOrder, toast);
  };

  /** Columns for ReusableTable */
  const columns = [
    { header: "Refund ID", accessor: "id", sortable: true },
    { header: "Order ID", accessor: "orderId", sortable: true },
    { header: "Date", accessor: "createdAt", sortable: true },
    { header: "Customer", accessor: "customerName", sortable: true },
    { header: "Total", accessor: "totalAmount", sortable: true },
    { header: "Payment Mode", accessor: "paymentType", sortable: true },
    { header: "Status", accessor: "status", type: "status", sortable: true },
  ];

  /** Transform refunds for table */
  const tableData = refunds.map((r) => ({
    id: r.id,
    orderId: r.order?.id || "-",
    createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : "-",
    customerName: r.customer?.fullName || "Walk-in Customer",
    totalAmount: `LKR ${Number(r.totalAmount || 0).toFixed(2)}`,
    paymentType: r.paymentType || "CASH",
    status: r.status || "REFUNDED",
    original: r,
  }));

  return (
    <ContentLayout
      loadingSpinner={loading}
      title={"Refund History"}
      subTitle={"View, filter, and paginate refund records."}
      right={
        <Button variant="outline" onClick={() => loadOrders({ pageSize: 10 })} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      }
    >
      <div className="h-full flex flex-col p-4">
        {loading && tableData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Loader2 className="animate-spin h-16 w-16 text-primary" />
            <p className="mt-4">Loading refunds...</p>
          </div>
        ) : (
          <ReusableTable
            columns={columns}
            data={tableData}
            loading={loading}
            actions={(row) => (
              <Button variant="ghost" size="icon" onClick={() => handleViewOrder(row.original)}>
                <EyeIcon className="h-4 w-4" />
              </Button>
            )}
            isServer={true}
            page={pageInfo?.currentPage || 0}
            totalPages={pageInfo?.totalPages || 1}
            sort={sort}
            onSortChange={(newSort) => setSort(newSort)}
            onPageChange={(newPage) => loadOrders({ pageSize: pageInfo?.pageSize || 10 }, newPage)}
            onFilter={(filters) => loadOrders(filters, 0)}
          />
        )}

        {/* Order Details Modal */}
        <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
          {selectedOrder && (
            <DialogContent className="sm:max-w-[80%] max-h-[99vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Refund Details - Invoice</DialogTitle>
              </DialogHeader>

              <OrderDetails selectedOrder={selectedOrder} />

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                <Button>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </ContentLayout>
  );
};

export default OrderRefundHistoryPage;