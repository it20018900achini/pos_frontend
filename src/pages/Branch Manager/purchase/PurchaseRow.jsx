// src/components/purchase/PurchaseRow.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const PurchaseRow = ({ value, products, onChange, onRemove }) => {
  const handleProductChange = (e) => {
    
    const variantId = Number(e.target.value);
    const selected = products.find((p) => p.productVariant?.id === variantId);
    alert("selected: " + JSON.stringify(selected));
    if (!selected) return;

    onChange({
      ...value,
      productVariantId: selected.productVariant.id,     // ✅ REQUIRED BY BACKEND
      costPrice: selected.productVariant.price ?? 0,     // default price
    });
  };

  return (
    <div className="flex gap-2 items-center border rounded p-2">
      {/* Product Select */}
      <div className="w-full">
        
      <label className="block text-sm font-medium mb-1">Product</label>
{JSON.stringify(value)}
      <select
        className="border rounded p-2 flex-1 w-full"
        value={value.productVariantId ?? ""}
        onChange={handleProductChange}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.productVariant.id} value={p.productVariant.id}>
            
            {p?.productVariant?.name} - SKU: {p?.productVariant?.sku}
          </option>
        ))}
      </select>
      </div>
<div>
<label className="block text-sm font-medium mb-1">Quantity</label>
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
</div>
      {/* Quantity */}
     

      {/* Cost Price */}
      <div>
        <label className="block text-sm font-medium mb-1">Cost Price</label>

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
      </div>



      {/* Remove */}
      <Button variant="outline" onClick={onRemove}>
        ✕
      </Button>
    </div>
  );
};

export default PurchaseRow;
