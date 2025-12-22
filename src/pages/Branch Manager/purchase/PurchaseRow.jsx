import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";

const PurchaseRow = ({ value, onChange, onRemove, products = [] }) => {
  // Map products to react-select options safely
  const options = products.map((p) => ({ value: p.id, label: p.name }));

  // Calculate total
  const total = (value.quantity || 0) * (value.costPrice || 0);

  return (
    <div className="flex gap-3 items-end">
      {/* Product select */}
      <div className="w-full">

      <Select
        options={options}
        className="w-full"
        placeholder="Select product..."
        value={options.find((opt) => opt.value === value.productId) || null}
        onChange={(selected) =>
          onChange({ ...value, productId: selected ? selected.value : null })
        }
        isClearable
      />

      </div>

      {/* Quantity input */}
      <Input
        type="number"
        min={1}
        placeholder="Qty"
        value={value.quantity}
        onChange={(e) =>
          onChange({ ...value, quantity: Math.max(1, Number(e.target.value)) })
        }
      />

      {/* Cost Price input */}
      <Input
        type="number"
        min={0}
        step="0.01"
        placeholder="Cost Price"
        value={value.costPrice ?? ""}
        onChange={(e) =>
          onChange({ ...value, costPrice: Number(e.target.value) })
        }
      />

      {/* Total amount (read-only) */}
      <Input
        type="number"
        value={total.toFixed(2)}
        readOnly
        className="bg-gray-100"
      />

      {/* Remove button */}
      <Button variant="destructive" type="button" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
};

export default PurchaseRow;
