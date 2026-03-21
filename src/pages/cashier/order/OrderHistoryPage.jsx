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

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: "id", direction: "desc" });
  const [showRefundModal, setShowRefundModal] = useState(false);

  const { data, isLoading, error, refetch } = useGetOrdersByCashierQuery(
    {
      cashierId: userProfile?.user.id,
      page,
      size,
      search,
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

    // Modern status badge
  const renderStatus = (status) => {
    const classes =
      status === "REFUNDED"
        ? "bg-red-100 text-red-800"
        : status === "PAID" || status === "COMPLETED"
        ? "bg-green-100 text-green-800"
        : status === "PENDING"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${classes}`}>
        {status}
      </span>
    );
  };
  // Map orders for ReusableTable
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
    status: o.status, // render badge here
    createdAt: new Date(o.createdAt).toLocaleString(),
    raw: o, // keep full object for modal
  }));

  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Customer", accessor: "customerName",  },
    { header: "Phone", accessor: "customerPhone" },
    { header: "Email", accessor: "customerEmail" },
    { header: "Items", accessor: "items" },
    { header: "Payments", accessor: "payments" },
    { header: "Subtotal", accessor: "subtotal",  },
    { header: "Discount", accessor: "discount",  },
    { header: "Net Amount", accessor: "netAmount",  },
    { header: "Status", accessor: "status",  },
    { header: "Date", accessor: "createdAt",  },
  ];

  return (
    <ContentLayout
      title="Order History"
      subTitle="Server-side advanced table with full details"
      right={
        <Button onClick={() => { refetch(); toast({ title: "Refreshing..." }); }}>
          Refresh
        </Button>
      }
    >
      <div className="p-4">
        <ReusableTable
        enableSearch={true}
          columns={columns}
          data={tableData}
          loading={isLoading}
          isServer={true}
          page={page + 1} // ReusableTable expects 1-based page
          totalPages={pageInfo?.totalPages || 1}
          pageSize={size}
          onPageChange={(p) => setPage(p - 1)} // convert back to 0-based
          searchFields={["id", "customerName", "customerPhone", "customerEmail", "items"]}
          onSearchChange={(text) => {
            setSearch(text);
            setPage(0);
          }}
          sort={sort}
          onSortChange={(s) => {
            setSort(s);
            setPage(0);
          }}
          actions={(row) => (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleViewOrder(row)}>
                View
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleRefundOrder(row)}>
                Refund
              </Button>
            </div>
          )}
          exportTypes={["csv", "excel", "pdf"]}
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