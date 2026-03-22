"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import ContentLayout from "../../Dashboard/ContentLayout";
import ReusableTable from "../../common/ReusableTable";
import RefundModal from "./RefundModal";

import { setCurrentOrder } from "@/Redux Toolkit/features/order/orderSlice";
import { useGetOrdersByCashierQuery } from "@/Redux Toolkit/features/order/orderApi";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);

  /** ✅ CENTRALIZED FILTER STATE */
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentType: "",
    startDate: "",
    endDate: "",
    pageSize: 10,
  });

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: "id", direction: "desc" });
  const [showRefundModal, setShowRefundModal] = useState(false);

  /** ✅ API CALL USING FILTERS */
  const { data, isLoading, error, refetch } = useGetOrdersByCashierQuery(
    {
      cashierId: userProfile?.user.id,
      page,
      size: filters.pageSize,
      search: filters.search,
      status: filters.status,
      paymentType: filters.paymentType,
      start: filters.startDate,
      end: filters.endDate,
      sort: `${sort.field},${sort.direction}`,
    },
    { skip: !userProfile?.user.id }
  );

  const orders = data?.orders || [];
  const pageInfo = data?.pageInfo;

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading orders",
        description: error?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [error]);

  const selectedOrder = useSelector((state) => state.order.selectedOrder);

  const handleViewOrder = (row) => {
    const order = row.raw || row;
    dispatch(setCurrentOrder(order));
    toast({ title: `Viewing Order #${order.id}` });
  };

  const handleRefundOrder = (row) => {
    const order = row.raw || row;
    dispatch(setCurrentOrder(order));
    setShowRefundModal(true);
  };

  /** ✅ TABLE DATA */
  const tableData = orders.map((o) => ({
    id: o.id,
    customerName: o.customer?.fullName || "Walk-in",
    customerPhone: o.customer?.phone || "-",
    customerEmail: o.customer?.email || "-",
    items: o.items?.map((i) => `${i.product.name} x${i.quantity}`).join(", "),
    payments: o.payments?.map((p) => `${p.paymentMethod}: ${p.amount}`).join(", "),
    subtotal: o.subtotal,
    discount: o.discountAmount,
    netAmount: o.netAmount,
    status: o.status,
    createdAt: new Date(o.createdAt).toLocaleString(),
    raw: o,
  }));

  /** ✅ COLUMNS */
  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Customer", accessor: "customerName" },
    { header: "Phone", accessor: "customerPhone" },
    { header: "Email", accessor: "customerEmail" },
    { header: "Items", accessor: "items" },
    { header: "Payments", accessor: "payments" },
    { header: "Subtotal", accessor: "subtotal" },
    { header: "Discount", accessor: "discount" },
    { header: "Net Amount", accessor: "netAmount" },
    { header: "Status", accessor: "status", type: "status" }, // ✅ use reusable badge
    { header: "Date", accessor: "createdAt" },
  ];

  return (
    <ContentLayout
      title="Order History"
      subTitle="Server-side advanced table"
      right={
        <Button
          onClick={() => {
            refetch();
            toast({ title: "Refreshing..." });
          }}
        >
          Refresh
        </Button>
      }
    >
      <div className="p-4">
        <ReusableTable
          columns={columns}
          data={tableData}
          loading={isLoading}

          /** ✅ SERVER MODE */
          isServer={true}

          /** ✅ PAGINATION */
          page={page}
          totalPages={pageInfo?.totalPages || 1}
          onPageChange={(p) => setPage(p)}

          /** ✅ FILTER SYSTEM */
          filters={filters}
          setFilters={setFilters}
          onFilter={(f) => {
            setPage(0);
          }}

          /** ✅ ENABLE FEATURES */
          enableSearch
          enableDateRange
          // enableStatusFilter
          // enablePaymentFilter
          enablePageSize

          /** ✅ SORT */
          sort={sort}
          onSortChange={(s) => {
            setSort(s);
            setPage(0);
          }}

          /** ✅ ACTIONS */
          actions={(row) => (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleViewOrder(row)}>
                View
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRefundOrder(row)}
              >
                Refund
              </Button>
            </div>
          )}
        />

        {selectedOrder && (
          <RefundModal
            open={showRefundModal}
            order={selectedOrder}
            onClose={() => setShowRefundModal(false)}
            onSubmit={() => setShowRefundModal(false)}
          />
        )}
      </div>
    </ContentLayout>
  );
};

export default OrderHistoryPage;