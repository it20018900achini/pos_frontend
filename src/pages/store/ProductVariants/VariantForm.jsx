import React, { useState, useEffect } from "react";
import { useCreateProductVariantMutation, useUpdateProductVariantMutation } from "../../../Redux Toolkit/features/product/productApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

export default function VariantForm({ variant = null,  onSuccess }) {
      const { products, loading, error, searchResults } = useSelector(
        (state) => state.product
      );
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    sku: "",
    barcode: "",
    sellingPrice: 0,
    costPrice: 0,
    unit: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    expiryDate: "",
    isActive: true,
    isFeatured: false,
    taxRate: 0,
    imageUrl: "",
  });

  const [createVariant] = useCreateProductVariantMutation();
  const [updateVariant] = useUpdateProductVariantMutation();

  useEffect(() => {
    if (variant) setFormData({ ...formData, ...variant });
  }, [variant]);

  // Generic change handler
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (variant?.id) {
      await updateVariant({ id: variant.id, ...formData });
    } else {
      await createVariant(formData);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded">
      {/* Product Select */}
      {/* <div className="flex flex-col">
        <Label>Product</Label>
        <select
          className="border p-2 rounded"
          value={formData.productId}
          onChange={(e) => handleChange("productId", e.target.value)}
          required
        >
          <option value="">Select product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div> */}

      <Input placeholder="productId" value={formData.productId} onChange={e => handleChange("productId", e.target.value)} />
      <Input placeholder="Name" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
      <Input placeholder="SKU" value={formData.sku} onChange={e => handleChange("sku", e.target.value)} />
      <Input placeholder="Barcode" value={formData.barcode} onChange={e => handleChange("barcode", e.target.value)} />
      <Input placeholder="Unit" value={formData.unit} onChange={e => handleChange("unit", e.target.value)} />
      <Input placeholder="Image URL" value={formData.imageUrl} onChange={e => handleChange("imageUrl", e.target.value)} />

      <Input type="number" placeholder="Selling Price" value={formData.sellingPrice} onChange={e => handleChange("sellingPrice", parseFloat(e.target.value))} />
      <Input type="number" placeholder="Cost Price" value={formData.costPrice} onChange={e => handleChange("costPrice", parseFloat(e.target.value))} />
      <Input type="number" placeholder="Weight" value={formData.weight} onChange={e => handleChange("weight", parseFloat(e.target.value))} />
      <Input type="number" placeholder="Length" value={formData.length} onChange={e => handleChange("length", parseFloat(e.target.value))} />
      <Input type="number" placeholder="Width" value={formData.width} onChange={e => handleChange("width", parseFloat(e.target.value))} />
      <Input type="number" placeholder="Height" value={formData.height} onChange={e => handleChange("height", parseFloat(e.target.value))} />
      <Input type="number" placeholder="Tax Rate (%)" value={formData.taxRate} onChange={e => handleChange("taxRate", parseFloat(e.target.value))} />

      <Input type="date" placeholder="Expiry Date" value={formData.expiryDate} onChange={e => handleChange("expiryDate", e.target.value)} />

      <div className="flex gap-4">
        <Checkbox checked={formData.isActive} onCheckedChange={val => handleChange("isActive", val)}>Active</Checkbox>
        <Checkbox checked={formData.isFeatured} onCheckedChange={val => handleChange("isFeatured", val)}>Featured</Checkbox>
      </div>

      <Button type="submit">{variant ? "Update Variant" : "Create Variant"}</Button>
    </form>
  );
}
