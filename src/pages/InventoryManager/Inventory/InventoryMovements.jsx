"use client";

import React, { useState } from "react";
import { useGetInventoryMovementsQuery } from "../../../Redux Toolkit/features/inventory/inventoryApi";
import { useSelector } from "react-redux";
import ContentLayout from "../../Dashboard/ContentLayout";
import ReusableTable from "@/pages/common/ReusableTable"; // Ensure path is correct

const InventoryMovements = () => {
  const { selectedBranchId } = useSelector((state) => state.user);
  
  // 1. Manage Table State
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    pageSize: 20,
  });

  // 2. Fetch Data (Server-side)
  const { data, isLoading, isError } = useGetInventoryMovementsQuery({
    branchId: selectedBranchId,
    page: page,
    size: filters.pageSize,
    // search: filters.search, // Uncomment if your API supports search
  });

  if (isError) return <div className="p-4 text-red-500 font-bold">Something went wrong!</div>;

  // 3. Define Columns
  const columns = [
    { header: "ID", accessor: "id" },
    { 
      header: "Type", 
      accessor: "type",
      render: (val) => (
        <span className={`font-bold ${val === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {val}
        </span>
      )
    },
    { header: "Qty Change", accessor: "quantityChange" },
    { 
      header: "Product", 
      accessor: "product", 
      render: (product) => <span className="font-medium">{product?.name}</span> 
    },
    { 
      header: "Variant", 
      accessor: "variant",
      render: (variant) => (
        <div className="flex items-center space-x-2">
          {variant?.imageUrl && (
            <img
              src={variant.imageUrl}
              alt={variant.name}
              className="w-8 h-8 rounded object-cover shadow-sm border"
            />
          )}
          <span>{variant?.name}</span>
        </div>
      )
    },
    { header: "Reference", accessor: "reference" },
    { 
      header: "Date", 
      accessor: "createdAt",
      render: (date) => new Date(date).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    },
  ];

  return (
    <ContentLayout 
      title="Inventory Movements" 
      subTitle="Track all inventory changes in your branch."
    >
      <div className="bg-card rounded-3xl border shadow-sm p-2">
        <ReusableTable
          columns={columns}
          data={data?.content || []}
          loading={isLoading}
          
          // Server-side props
          isServer={true} 
          page={page}
          totalPages={data?.totalPages || 0}
          onPageChange={(newPage) => setPage(newPage)}
          
          // Filter props
          enableSearch={true}
          enablePageSize={true}
          filters={filters}
          setFilters={setFilters}
          onFilter={(updatedFilters) => {
            setFilters(updatedFilters);
            setPage(0); // Reset to first page when filtering
          }}
        />
      </div>
    </ContentLayout>
  );
};

export default InventoryMovements;