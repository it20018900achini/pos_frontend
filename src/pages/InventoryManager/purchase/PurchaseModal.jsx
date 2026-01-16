// src/components/purchase/PurchaseModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addPurchase } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import { getSuppliers } from "@/Redux Toolkit/features/suppliers/supplierSlice";
import { useGetProductVariantsByStoreQuery } from "@/Redux Toolkit/features/product/productApi";

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

/* -------------------- constants -------------------- */
const INITIAL_ITEM = {
  productVariantId: null,
  quantity: 1,
  costPrice: 0,
};

const INITIAL_PAYMENT = {
  paymentMethod: "CASH",
  amount: 0,
  reference: "",
};

const BRANCH_ID = 52;

/* -------------------- component -------------------- */
const PurchaseModal = ({ open, onClose, storeId = 2 }) => {
  const dispatch = useDispatch();
  const { suppliers } = useSelector((state) => state.supplier);

  const { data: products = [] } = useGetProductVariantsByStoreQuery(storeId);

  const [supplierId, setSupplierId] = useState(null);
  const [items, setItems] = useState([{ ...INITIAL_ITEM }]);
  const [payments, setPayments] = useState([{ ...INITIAL_PAYMENT }]);

  /* -------------------- effects -------------------- */
  useEffect(() => {
    dispatch(getSuppliers({ page: 0, size: 50 }));
  }, [dispatch]);

  /* -------------------- item handlers -------------------- */
  const addItem = () =>
    setItems((prev) => [...prev, { ...INITIAL_ITEM }]);

  const updateItem = (index, updated) =>
    setItems((prev) =>
      prev.map((item, i) => (i === index ? updated : item))
    );

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  /* -------------------- payment handlers -------------------- */
  const addPayment = () =>
    setPayments((prev) => [...prev, { ...INITIAL_PAYMENT }]);

  const updatePayment = (index, updated) =>
    setPayments((prev) =>
      prev.map((p, i) => (i === index ? updated : p))
    );

  const removePayment = (index) =>
    setPayments((prev) => prev.filter((_, i) => i !== index));

  /* -------------------- totals -------------------- */
  const grandTotal = useMemo(
    () =>
      items.reduce(
        (total, { quantity, costPrice }) =>
          total + (quantity || 0) * (costPrice || 0),
        0
      ),
    [items]
  );

  const paymentTotal = useMemo(
    () =>
      payments.reduce(
        (total, { amount }) => total + (amount || 0),
        0
      ),
    [payments]
  );

  /* -------------------- validation -------------------- */
  const hasValidSupplier = !!supplierId;

  const hasValidItems = items.some(
    (i) => i.productVariantId && i.quantity > 0 && i.costPrice >= 0
  );

  const hasValidPayments = payments.some(
    (p) => p.paymentMethod && p.amount > 0
  );

  const isPaymentMatch =
    Number(paymentTotal.toFixed(2)) === Number(grandTotal.toFixed(2));

  const canSave =
    hasValidSupplier &&
    hasValidItems &&
    hasValidPayments &&
    isPaymentMatch;

  /* -------------------- submit -------------------- */
  const handleSubmit = () => {
    if (!canSave) return;

    const cleanItems = items.map(({ productVariantId, quantity, costPrice }) => ({
      productVariantId,
      quantity,
      price: costPrice,
    }));

    const cleanPayments = payments.filter((p) => p.amount > 0);

    dispatch(
      addPurchase({
        supplierId,
        branchId: BRANCH_ID,
        items: cleanItems,
        payments: cleanPayments,
      })
    );

    onClose();
  };

  /* -------------------- render -------------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] overflow-y-auto h-screen">
        <DialogHeader>
          <DialogTitle>Create Purchase</DialogTitle>
        </DialogHeader>

        {/* Supplier */}
        <div className="space-y-2">
          <Label>Supplier</Label>
          <select
            className="w-full rounded-md border p-2"
            value={supplierId ?? ""}
            onChange={(e) =>
              setSupplierId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Select Supplier</option>
            {suppliers.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <PurchaseRow
              key={index}
              value={item}
              products={products}
              onChange={(val) => updateItem(index, val)}
              onRemove={() => removeItem(index)}
            />
          ))}
        </div>

        <Button className="mt-3" variant="outline" onClick={addItem}>
          + Add Product
        </Button>

        {/* Payments */}
        <div className="mt-6 space-y-3">
          <Label>Payments</Label>

          {payments.map((p, index) => (
            <div key={index} className="flex w-full">
              <select
                className="rounded border p-2"
                value={p.paymentMethod}
                onChange={(e) =>
                  updatePayment(index, {
                    ...p,
                    paymentMethod: e.target.value,
                  })
                }
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="MOBILE_PAYMENT">Mobile Payment</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CREDIT">Credit</option>
              </select>

              <input
                type="number"
                className="w-32 rounded border p-2"
                value={p.amount}
                onChange={(e) =>
                  updatePayment(index, {
                    ...p,
                    amount: Number(e.target.value),
                  })
                }
              />

              <input
                type="text"
                className="flex-1 rounded border p-2"
                placeholder="Reference"
                value={p.reference}
                onChange={(e) =>
                  updatePayment(index, {
                    ...p,
                    reference: e.target.value,
                  })
                }
              />

              <Button variant="outline" onClick={() => removePayment(index)}>
                ✕
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addPayment}>
            + Add Payment
          </Button>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6 flex flex-col gap-2">
          <div className="flex justify-between font-semibold">
            <span>Grand Total</span>
            <span>{grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Payment Total</span>
            <span>{paymentTotal.toFixed(2)}</span>
          </div>

          {!isPaymentMatch && (
            <p className="text-sm text-red-500">
              Payment total must match grand total
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSave}>
              Save Purchase
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
