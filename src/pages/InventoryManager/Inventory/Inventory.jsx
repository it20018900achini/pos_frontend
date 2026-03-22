"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  getInventoryByBranch,
  updateInventory,
} from "@/Redux Toolkit/features/inventory/inventoryThunks";

import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryFormDialog from "./InventoryFormDialog";
import ContentLayout from "../../Dashboard/ContentLayout";
import ReusableTable from "@/pages/common/ReusableTable"; // Import your reusable component

const Inventory = () => {
  const dispatch = useDispatch();
  const branch = useSelector((state) => state.branch.branch);
  const { inventories = [], loading = false } = useSelector(
    (state) => state.inventory || {}
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Local state for ReusableTable filters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    pageSize: 10,
  });

  /* FETCH INVENTORY */
  useEffect(() => {
    if (branch?.id) {
      dispatch(getInventoryByBranch(branch.id));
    }
  }, [branch, dispatch]);

  /* OPEN EDIT */
  const handleEdit = (row) => {
    setSelectedInventory(row);
    setQuantity(row.quantity);
    setIsEditDialogOpen(true);
  };

  /* UPDATE */
  const handleUpdate = async () => {
    if (!selectedInventory) return;

    await dispatch(
      updateInventory({
        id: selectedInventory.id,
        dto: {
          branchId: selectedInventory.branchId,
          productId: selectedInventory.productId,
          productVariantId: selectedInventory.productVariantId,
          quantity: Number(quantity),
        },
      })
    );

    setIsEditDialogOpen(false);
    setSelectedInventory(null);
    setQuantity(1);
    dispatch(getInventoryByBranch(branch.id));
  };

  /** TABLE COLUMN DEFINITION **/
  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { 
      header: "Product / Variant", 
      accessor: "variantName", 
      render: (_, row) => (
        <div>
          <p className="font-bold">{row.variantName}</p>
          <p className="text-xs text-muted-foreground">{row.productName}</p>
        </div>
      )
    },
    { header: "Quantity", accessor: "quantity", sortable: true },
    { header: "Reorder Level", accessor: "reorderLevel" },
    { 
      header: "Status", 
      accessor: "status", 
      render: (_, row) => {
        const isLowStock = row.quantity <= row.reorderLevel;
        return isLowStock ? (
          <Badge variant="destructive">LOW STOCK</Badge>
        ) : (
          <Badge variant="secondary">OK</Badge>
        );
      }
    },
  ];

  return (
    <ContentLayout title="Inventory Management" subTitle="Manage your branch's inventory here.">
      <div className="space-y-6">
        
        {loading ? (
          <InventoryTableSkeleton />
        ) : (
          <ReusableTable
            columns={columns}
            data={inventories}
            loading={loading}
            enableSearch={true}
            filters={filters}
            setFilters={setFilters}
            actions={(row) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(row)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          />
        )}

        <InventoryFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          quantity={quantity}
          setQuantity={setQuantity}
          onSubmit={handleUpdate}
          mode="edit"
        />
      </div>
    </ContentLayout>
  );
};

export default Inventory;