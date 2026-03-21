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

  /** ----------------- FILTER STATE (GLOBAL) ----------------- */
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
    status: "",
    paymentType: "",
    pageSize: 10,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [sort, setSort] = useState(null);

  /** ----------------- LOAD ORDERS ----------------- */
  const loadOrders = (customFilters = filters, page = 0) => {
    if (!userProfile?.user?.id) return;

    dispatch(
      getRefundsByCashier({
        cashierId: userProfile.user.id,
        page,
        size: customFilters.pageSize,
        sort: sort ? `${sort.field},${sort.direction}` : "id,desc",
        start: customFilters.startDate || undefined,
        end: customFilters.endDate || undefined,
        search: customFilters.search || undefined,
        status: customFilters.status || undefined,
        paymentType: customFilters.paymentType || undefined,
      })
    );
  };

  /** ----------------- INITIAL LOAD ----------------- */
  useEffect(() => {
    if (userProfile?.user?.id) loadOrders(filters, 0);
  }, [userProfile, sort]);

  /** ----------------- ERROR HANDLING ----------------- */
  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Refunds",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  /** ----------------- TABLE ACTIONS ----------------- */
  const handleViewOrder = (refund) => {
    setSelectedOrder(refund);
    setShowOrderDetailsDialog(true);
  };

  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;
    await handleDownloadOrderPDF(selectedOrder, toast);
  };

  const handleRefresh = () => {
    loadOrders(filters, pageInfo?.number ?? 0);
  };

  /** ----------------- TABLE COLUMNS ----------------- */
  const columns = [
    { header: "Refund ID", accessor: "id", sortable: true },
    { header: "Order ID", accessor: "orderId", sortable: true },
    { header: "Date", accessor: "createdAt", sortable: true },
    { header: "Customer", accessor: "customerName", sortable: true },
    { header: "Total", accessor: "totalAmount", sortable: true },
    { header: "Payment Mode", accessor: "paymentType", sortable: true },
    { header: "Status", accessor: "status", type: "status", sortable: true },
  ];

  /** ----------------- TRANSFORM DATA FOR TABLE ----------------- */
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
      title="Refund History"
      subTitle="View, filter, and paginate refund records."
      right={
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
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
  isServer={true}
  page={pageInfo?.number ?? 0}
  totalPages={pageInfo?.totalPages ?? 1}
  sort={sort}
  onSortChange={(newSort) => setSort(newSort)}
  onPageChange={(newPage) => loadOrders(filters, newPage)}
  
  /** Pass filters from parent */
  filters={filters}
  setFilters={setFilters}
  onFilter={(newFilters) => {
    setFilters(newFilters);
    loadOrders(newFilters, 0);
  }}

  /** Enable filters */
  enableSearch
  enableDateRange
  enableStatusFilter
  enablePaymentFilter
  enablePageSize
/>
        )}

        {/* ----------------- ORDER DETAILS MODAL ----------------- */}
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