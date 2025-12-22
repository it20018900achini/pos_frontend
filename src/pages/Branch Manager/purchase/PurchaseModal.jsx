// src/components/purchase/PurchaseModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPurchase } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import { getSuppliers } from "@/Redux Toolkit/features/suppliers/supplierSlice";
import { useGetProductsByStoreQuery } from "@/Redux Toolkit/features/product/productApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PurchaseRow from "./PurchaseRow";

const PurchaseModal = ({ open, onClose, storeId = 2 }) => {
  const dispatch = useDispatch();
  const { suppliers } = useSelector((state) => state.supplier);

  const { data: products = [] } = useGetProductsByStoreQuery(storeId);

  const [supplierId, setSupplierId] = useState(null);
  const [items, setItems] = useState([{ productId: null, quantity: 1, costPrice: 0 }]);

  // Load suppliers on mount
  useEffect(() => {
    dispatch(getSuppliers({ page: 0, size: 50 }));
  }, [dispatch]);

  // --- Handlers ---
  const addRow = () =>
    setItems((prev) => [...prev, { productId: null, quantity: 1, costPrice: 0 }]);

  const updateRow = (index, updated) =>
    setItems((prev) => prev.map((item, i) => (i === index ? updated : item)));

  const removeRow = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!supplierId) return alert("Please select a supplier");

    const cleanItems = items
      .filter((i) => i.productId && i.quantity > 0 && i.costPrice >= 0)
      .map(({ productId, quantity, costPrice }) => ({
        productId,
        quantity,
        price: costPrice, // send costPrice as "price"
      }));

    if (!cleanItems.length) return alert("Please add at least one product");

    dispatch(addPurchase({ supplierId, items: cleanItems }));
    onClose();
  };

  // --- Calculate Grand Total ---
  const grandTotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.quantity || 0) * (i.costPrice || 0), 0),
    [items]
  );

  // --- Render ---
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Purchase</DialogTitle>
        </DialogHeader>

        {/* Supplier Select */}
        <div className="space-y-2 mb-4">
          <Label>Supplier</Label>
          <select
            className="w-full border rounded-md p-2"
            value={supplierId ?? ""}
            onChange={(e) =>
              setSupplierId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Purchase Items */}
        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <PurchaseRow
              key={index}
              value={item}
              onChange={(val) => updateRow(index, val)}
              onRemove={() => removeRow(index)}
              products={products}
            />
          ))}
        </div>

        <Button variant="outline" onClick={addRow}>
          + Add Product
        </Button>

        {/* Footer */}
        <DialogFooter className="mt-4 flex flex-col gap-2">
          <div className="text-right font-semibold">
            Grand Total: {grandTotal.toFixed(2)}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Purchase</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
