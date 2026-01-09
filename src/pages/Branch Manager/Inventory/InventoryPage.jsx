// src/pages/InventoryPage.jsx
import React, { useState } from "react";

import InventoryForm from "./components/InventoryForm";
import { useDeleteInventoryMutation,useGetInventoriesByBranchQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation } from "../../../Redux Toolkit/features/inventory/inventoryApi";

const InventoryPage = ({ branchId = 1 }) => {
  const { data: inventories, isLoading } = useGetInventoriesByBranchQuery(branchId);
  const [createInventory] = useCreateInventoryMutation();
  const [updateInventory] = useUpdateInventoryMutation();
  const [deleteInventory] = useDeleteInventoryMutation();

  const [editingInventory, setEditingInventory] = useState(null);

  const handleCreate = async (dto) => {
    await createInventory({ ...dto, branchId });
  };

  const handleUpdate = async (dto) => {
    await updateInventory(dto);
    setEditingInventory(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) await deleteInventory(id);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory List</h1>

      <InventoryForm
        key={editingInventory?.id || "new"}
        initialData={editingInventory}
        onSubmit={editingInventory ? handleUpdate : handleCreate}
      />

      <ul className="mt-4">
        {inventories?.map((inv) => (
          <li key={inv.id} className="flex justify-between items-center border p-2 mb-2">
            <span>
              Product: {inv.productId} | Quantity: {inv.quantity}
            </span>
            <div>
              <button
                className="mr-2 bg-yellow-400 px-2 py-1 rounded"
                onClick={() => setEditingInventory(inv)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(inv.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryPage;
