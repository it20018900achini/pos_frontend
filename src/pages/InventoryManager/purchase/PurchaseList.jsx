"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { format } from "date-fns";
import { Plus, RotateCcw, Eye, Package } from "lucide-react";

import { getPurchases } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import PurchaseModal from "./PurchaseModal";
import ReturnPurchaseModal from "./ReturnPurchaseModal";
import ReusableTable from "@/pages/common/ReusableTable";
import { Button } from "@/components/ui/button";

const PurchaseList = () => {
  const dispatch = useDispatch();
  const { purchases, total, loading } = useSelector((state) => state.purchase);
  const { selectedBranchId } = useSelector((state) => state.user);

  // UI state
  const [openCreate, setOpenCreate] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Filter State (Matching ReusableTable requirements)
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    pageSize: 10,
  });
  const [page, setPage] = useState(0);

  /**
   * TABLE COLUMNS
   */
  const columns = [
    { 
      header: "Purchase ID", 
      accessor: "id", 
      render: (val) => <span className="font-mono text-xs font-bold text-slate-500">#{val}</span> 
    },
    { 
      header: "Supplier", 
      accessor: "supplier.name",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white">{row.supplier?.name || "N/A"}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Verified Provider</span>
        </div>
      )
    },
    { 
      header: "Items", 
      accessor: "items",
      render: (items) => (
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sm font-medium">{items?.length || 0} Products</span>
        </div>
      )
    },
    { 
      header: "Total Amount", 
      accessor: "totalAmount",
      render: (val) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          Rs. {Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    { 
      header: "Purchase Date", 
      accessor: "purchaseDate",
      render: (val) => val ? format(new Date(val), "MMM dd, yyyy • hh:mm a") : "—"
    },
    { 
      header: "Actions", 
      accessor: "id",
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => {
               // Logic to view specific items could go here
               console.log("Viewing items for:", row.items);
            }}
          >
            <Eye className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
            onClick={() => {
              setSelectedPurchase(row);
              setOpenReturn(true);
            }}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Return
          </Button>
        </div>
      )
    },
  ];

  /**
   * FETCHING LOGIC
   */
  const handleFetch = useCallback(
    debounce((p, s, currentFilters) => {
      dispatch(getPurchases({
        branchId: selectedBranchId,
        page: p,
        size: s,
        search: currentFilters.search,
        from: currentFilters.startDate || undefined,
        to: currentFilters.endDate || undefined,
      }));
    }, 400),
    [dispatch, selectedBranchId]
  );

  useEffect(() => {
    if (selectedBranchId) {
      handleFetch(page, filters.pageSize, filters);
    }
  }, [selectedBranchId, page, filters, handleFetch]);

  const totalPages = total ? Math.ceil(total / filters.pageSize) : 0;

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      

      {/* Main Table Container */}
      <div className="">
        <ReusableTable
          isServer={true}
          columns={columns}
          data={purchases || []}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          
          // Filtering Props
          filters={filters}
          setFilters={setFilters}
          onFilter={(updated) => {
            setFilters(updated);
            setPage(0);
          }}
          
          // Component Features
          enableSearch={true}
          enableDateRange={true}
          enablePageSize={true}
          searchPlaceholder="Search suppliers..."
        />
      </div>

      {/* Modals */}
      <PurchaseModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      {selectedPurchase && (
        <ReturnPurchaseModal
          open={openReturn}
          onClose={() => {
            setOpenReturn(false);
            setSelectedPurchase(null);
          }}
          purchase={selectedPurchase}
        />
      )}
    </div>
  );
};

export default PurchaseList;