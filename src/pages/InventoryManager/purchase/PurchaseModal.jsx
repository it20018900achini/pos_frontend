"use client";

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPurchase } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import PurchaseRow from "./PurchaseRow";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetProductVariantsByBranchQuery } from "../../../Redux Toolkit/features/product/productApi";
import { Label } from "@/components/ui/label";

// If you are using Shadcn Select, import it here. 
// Otherwise, I'll use a standard styled HTML select for compatibility.

const PurchaseModal = ({ open, onClose, suppliers = [] }) => {
  const dispatch = useDispatch();
  const { selectedBranchId } = useSelector((state) => state.user);
  
  const { data: products = [], isLoading } = useGetProductVariantsByBranchQuery(selectedBranchId);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([
    { productVariantId: "", quantity: 1, costPrice: 0 },
  ]);

  const addItem = () => {
    setItems((prev) => [...prev, { productVariantId: "", quantity: 1, costPrice: 0 }]);
  };

  const updateItem = (index, updatedItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  }, [items]);

  const canSave = useMemo(() => {
    if (!supplierId) return false;
    return items.length > 0 && items.every(item => 
      item.productVariantId && item.quantity > 0 && item.costPrice >= 0
    );
  }, [supplierId, items]);

  const handleSave = async () => {
    if (!canSave) return;

    const payload = {
      supplierId: Number(supplierId),
      totalAmount,
      branchId: selectedBranchId,
      items: items.map((item) => ({
        productVariantId: Number(item.productVariantId),
        quantity: Number(item.quantity),
        costPrice: Number(item.costPrice),
      })),
    };

    await dispatch(addPurchase(payload));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Supplier Selection */}
          <div className="space-y-2">
            <Label htmlFor="supplier" className="text-sm font-semibold text-slate-700">
              Select Supplier
            </Label>
            <select
              id="supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="" disabled>Choose a supplier...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.supplierName || s.name} {s.companyName ? `(${s.companyName})` : ""}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-slate-100" />

          {/* Items Table-like Header */}
          <div className="grid grid-cols-[2fr_1fr_1.2fr_40px] gap-4 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Product Variant</span>
            <span>Quantity</span>
            <span>Cost Price</span>
            <span></span>
          </div>

          <div className="space-y-3">
            
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

          <Button 
            variant="ghost" 
            onClick={addItem} 
            className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all"
          >
            + Add Another Item
          </Button>

          {/* Total & Summary */}
          <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
            <span className="text-slate-500 text-sm">Grand Total</span>
            <span className="text-2xl font-black text-indigo-600">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="px-8">
              Discard
            </Button>
            <Button 
              disabled={!canSave} 
              onClick={handleSave}
              className="px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
              Confirm Purchase
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;