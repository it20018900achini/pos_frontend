// src/components/purchase/PurchaseRow.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const PurchaseRow = ({ value, products, onChange, onRemove }) => {
  const handleProductChange = (e) => {
    const variantId = Number(e.target.value);
    const selected = products.find((p) => p.id === variantId);

    if (!selected) return;

    onChange({
      ...value,
      productVariantId: selected.id,     // ✅ REQUIRED BY BACKEND
      costPrice: selected.price ?? 0,     // default price
    });
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Product Select */}
      <select
        className="border rounded p-2 flex-1"
        value={value.productVariantId ?? ""}
        onChange={handleProductChange}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.sku}) — Stock: {p.stockQty}
          </option>
        ))}
      </select>

      {/* Quantity */}
      <input
        type="number"
        min="1"
        className="border rounded p-2 w-20"
        value={value.quantity}
        onChange={(e) =>
          onChange({
            ...value,
            quantity: Number(e.target.value),
          })
        }
      />

      {/* Cost Price */}
      <input
        type="number"
        min="0"
        className="border rounded p-2 w-28"
        value={value.costPrice}
        onChange={(e) =>
          onChange({
            ...value,
            costPrice: Number(e.target.value),
          })
        }
      />

      {/* Remove */}
      <Button variant="outline" onClick={onRemove}>
        ✕
      </Button>
    </div>
  );
};

export default PurchaseRow;
