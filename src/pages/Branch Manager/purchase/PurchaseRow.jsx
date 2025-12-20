// src/components/purchase/PurchaseRow.jsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PurchaseRow = ({ value, onChange, onRemove }) => {
  return (
    <div className="grid grid-cols-4 gap-3 items-end">
      <Input
        placeholder="Product ID"
        value={value.productId}
        onChange={(e) =>
          onChange({ ...value, productId: e.target.value })
        }
      />

      <Input
        type="number"
        placeholder="Qty"
        value={value.quantity}
        onChange={(e) =>
          onChange({ ...value, quantity: Number(e.target.value) })
        }
      />

      <Input
        type="number"
        placeholder="Cost Price"
        value={value.costPrice}
        onChange={(e) =>
          onChange({ ...value, costPrice: Number(e.target.value) })
        }
      />

      <Button variant="destructive" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
};

export default PurchaseRow;
