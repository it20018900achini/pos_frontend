import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

import { 
  getInventoryByBranch, 
  createInventory, 
  updateInventory 
} from "@/Redux Toolkit/features/inventory/inventoryThunks";

import { getProductsByStore } from "@/Redux Toolkit/features/product/productThunks";

import InventoryTable from "./InventoryTable";
import InventoryStats from "./InventoryStats";
import InventoryFilters from "./InventoryFilters";
import InventoryFormDialog from "./InventoryFormDialog";

import InventoryTableSkeleton from "./InventoryTableSkeleton";

const Inventory = () => {
  const dispatch = useDispatch();
  const branch = useSelector((state) => state.branch.branch);

  const { inventories, loading, error } = useSelector(state => state.inventory);
  const products = useSelector((state) => state.product.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [editInventory, setEditInventory] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editProductId, setEditProductId] = useState("");

  useEffect(() => {
    if (branch?.id) dispatch(getInventoryByBranch(branch?.id));
    if (branch?.storeId) dispatch(getProductsByStore(branch?.storeId));
  }, [branch, dispatch]);

  // Map inventory to show products
  const inventoryRows = inventories.map((inv) => {
    const product = products.find((p) => p?.id === inv.productId) || {};
    return {
      id: inv.id,
      sku: product.sku || inv.productId,
      name: product.name || "Unknown",
      quantity: inv.quantity,
      category: product.category || "",
      productId: inv.productId,
    };
  });

  // Apply filters
  const filteredRows = inventoryRows.filter((row) => {
    const matchesSearch = row.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || row.category === category;
    return matchesSearch && matchesCategory;
  });

  // Add Inventory
  const handleAddInventory = async () => {
    if (!selectedProductId || !quantity || !branch?.id) return;

    await dispatch(
      createInventory({
        branchId: branch.id,
        productId: selectedProductId,
        quantity: Number(quantity),
      })
    );

    setIsAddDialogOpen(false);
    setSelectedProductId("");
    setQuantity(1);
    dispatch(getInventoryByBranch(branch.id));
  };

  // Open Edit
  const handleOpenEditDialog = (row) => {
    setEditInventory(row);
    setEditQuantity(row.quantity);
    setEditProductId(row.productId);
    setIsEditDialogOpen(true);
  };

  // Save Edit
  const handleUpdateInventory = async () => {
    if (!editInventory?.id || !branch?.id) return;

    await dispatch(
      updateInventory({
        id: editInventory.id,
        dto: {
          branchId: branch.id,
          productId: editInventory.productId,
          quantity: Number(editQuantity),
        },
      })
    );

    setIsEditDialogOpen(false);
    setEditInventory(null);
    setEditQuantity(1);
    setEditProductId("");
    dispatch(getInventoryByBranch(branch.id));
  };

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>

        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Inventory
          </Button>

         
        </div>
      </div>

      {/* FILTERS */}
      <InventoryFilters
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
        category={category}
        onCategoryChange={setCategory}
        products={products}
        inventoryRows={inventoryRows}
      />

      {/* TABLE OR SKELETON */}
      {loading ? (
        <InventoryTableSkeleton />
      ) : (
        <InventoryTable rows={filteredRows} onEdit={handleOpenEditDialog} />
      )}

      {/* ADD DIALOG */}
      <InventoryFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        quantity={quantity}
        setQuantity={setQuantity}
        onSubmit={handleAddInventory}
        mode="add"
      />

      {/* EDIT DIALOG */}
      <InventoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedProductId={editProductId}
        setSelectedProductId={setEditProductId}
        quantity={editQuantity}
        setQuantity={setEditQuantity}
        onSubmit={handleUpdateInventory}
        mode="edit"
      />
    </div>
  );
};

export default Inventory;
