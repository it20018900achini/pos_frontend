import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QuotationItemsTable = ({ items, setItems }) => {
  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <table className="w-full border mb-2">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Product</th>
          <th className="p-2">Quantity</th>
          <th className="p-2">Unit Price</th>
          <th className="p-2">Total</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className="border-t">
            <td className="p-2">
              <Input
                value={item.productName}
                onChange={(e) => updateItem(idx, "productName", e.target.value)}
                placeholder="Product Name"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                value={item.unitPrice}
                min={0}
                onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
              />
            </td>
            <td className="p-2">{(item.quantity || 0) * (item.unitPrice || 0)}</td>
            <td className="p-2">
              <Button variant="destructive" onClick={() => removeItem(idx)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuotationItemsTable;
