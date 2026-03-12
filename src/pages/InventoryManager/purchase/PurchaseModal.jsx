import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addPurchase  } from "@/Redux Toolkit/features/purchase/purchaseSlice";

import PurchaseRow from "./PurchaseRow";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetProductVariantsByBranchQuery } from "../../../Redux Toolkit/features/product/productApi";

const PurchaseModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

const {selectedBranchId}=useSelector((state)=>state.user)
  const { data: products = [], isLoading, isError } =
    useGetProductVariantsByBranchQuery(selectedBranchId);


  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([
    { productVariantId: "", quantity: 1, costPrice: 0 },
  ]);

  // -----------------------------
  // Add new row
  // -----------------------------
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { productVariantId: "", quantity: 1, costPrice: 0 },
    ]);
  };

  // -----------------------------
  // Update row
  // -----------------------------
  const updateItem = (index, updatedItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  // -----------------------------
  // Remove row
  // -----------------------------
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // -----------------------------
  // Calculate total
  // -----------------------------
  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.quantity * item.costPrice;
    }, 0);
  }, [items]);

  // -----------------------------
  // Validation
  // -----------------------------
  const canSave = useMemo(() => {
    if (!supplierId) return false;
    if (!items || items.length === 0) return false;

    return items.every((item) => {
      if (!item.productVariantId) return false;
      if (!item.quantity || item.quantity <= 0) return false;
      if (item.costPrice == null || item.costPrice < 0) return false;
      return true;
    });
  }, [supplierId, items]);

  // -----------------------------
  // Save
  // -----------------------------
  const handleSave = async () => {
    if (!canSave) return;

    const payload = {
      supplierId: Number(supplierId),
      totalAmount,
      branchId:selectedBranchId,
      items: items.map((item) => ({
        productVariantId: Number(item.productVariantId),
        quantity: Number(item.quantity),
        costPrice: Number(item.costPrice),
      })),
    };

    await dispatch(addPurchase (payload));
    onClose();
  };

  // -----------------------------
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Purchase--</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Supplier */}
          <Input
            placeholder="Supplier ID"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          />

          {/* Items */}
          <div className="space-y-2">
            {/* {JSON.stringify(products)} */}
            {items.map((item, index) => (
              <PurchaseRow
                key={index}
                value={item}
                products={products || []}
                onChange={(updated) => updateItem(index, updated)}
                onRemove={() => removeItem(index)}
              />
            ))}
          </div>

          <Button variant="outline" onClick={addItem}>
            + Add Item
          </Button>

          {/* Total */}
          <div className="text-right font-semibold">
            Total: Rs. {totalAmount}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!canSave} onClick={handleSave}>
              Save Purchase
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
