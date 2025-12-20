// src/components/purchase/PurchaseModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPurchase } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import { getSuppliers } from "@/Redux Toolkit/features/suppliers/supplierSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PurchaseRow from "./PurchaseRow";

const PurchaseModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { suppliers } = useSelector((state) => state.supplier);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([
    { productId: "", quantity: 1, costPrice: 0 },
  ]);

  useEffect(() => {
    dispatch(getSuppliers({ page: 0, size: 50 }));
  }, [dispatch]);

  const addRow = () => {
    setItems([...items, { productId: "", quantity: 1, costPrice: 0 }]);
  };

  const updateRow = (index, updated) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
  };

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + i.quantity * i.costPrice,
    0
  );

  const handleSubmit = () => {
    dispatch(
      addPurchase({
        supplierId,
        items,
        totalAmount,
      })
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Purchase</DialogTitle>
        </DialogHeader>

        {/* Supplier */}
        <div className="space-y-2">
          <Label>Supplier</Label>
          <select
            className="w-full border rounded-md p-2"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Items */}
        <div className="space-y-3 mt-4">
          {items.map((item, index) => (
            <PurchaseRow
              key={index}
              value={item}
              onChange={(val) => updateRow(index, val)}
              onRemove={() => removeRow(index)}
            />
          ))}
        </div>

        <Button variant="outline" onClick={addRow}>
          + Add Product
        </Button>

        {/* Total */}
        <div className="text-right font-semibold text-lg">
          Total: Rs. {totalAmount.toFixed(2)}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
