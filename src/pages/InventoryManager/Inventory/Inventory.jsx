import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
  getInventoryByBranch,
  createInventory,
  updateInventory,
} from "@/Redux Toolkit/features/inventory/inventoryThunks";

import InventoryTable from "./InventoryTable";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryFormDialog from "./InventoryFormDialog";
import ContentLayout from "../../Dashboard/ContentLayout";

const Inventory = () => {
  const dispatch = useDispatch();

  const branch = useSelector((state) => state.branch.branch);

  // ✅ SAFE DEFAULTS (THIS FIXES YOUR ERROR)
  const { inventories = [], loading = false } = useSelector(
    (state) => state.inventory || {}
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [selectedInventory, setSelectedInventory] = useState(null);
  const [quantity, setQuantity] = useState(1);

  /* FETCH INVENTORY */
  useEffect(() => {
    if (branch?.id) {
      dispatch(getInventoryByBranch(branch.id));
    }
  }, [branch, dispatch]);

  /* FILTER */
  const filteredRows = inventories.filter((inv) =>
    inv.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <ContentLayout title="Inventory Management" subTitle="Manage your branch's inventory here.">
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>

        {/* <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Inventory
        </Button> */}
      </div>

      {/* SEARCH */}
      <input
        className="border p-2 rounded w-full"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* TABLE */}
      {loading ? (
        <InventoryTableSkeleton />
      ) : (
        <InventoryTable rows={filteredRows} onEdit={handleEdit} />
      )}

      {/* EDIT DIALOG */}
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
