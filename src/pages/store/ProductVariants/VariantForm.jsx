import React, { useState, useEffect } from "react";
import { useCreateProductVariantMutation, useUpdateProductVariantMutation } from "../../../Redux Toolkit/features/product/productApi";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function VariantForm({ variant = null, onSuccess }) {
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

  const [imageFile, setImageFile] = useState(null); // Preview
  const [createVariant] = useCreateProductVariantMutation();
  const [updateVariant] = useUpdateProductVariantMutation();

  useEffect(() => {
    if (variant) setFormData({ ...formData, ...variant });
  }, [variant]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
      const uploadedUrl = await uploadToCloudinary(file);
      handleChange("imageUrl", uploadedUrl);
    }
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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{variant ? "Edit Variant" : "Create Variant"}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Product & Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label>Product ID</Label>
            <Input
              placeholder="Product ID"
              value={formData.productId}
              onChange={e => handleChange("productId", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <Label>Name</Label>
            <Input
              placeholder="Variant Name"
              value={formData.name}
              onChange={e => handleChange("name", e.target.value)}
              required
            />
          </div>
        </div>

        {/* SKU & Barcode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label>SKU</Label>
            <Input placeholder="SKU" value={formData.sku} onChange={e => handleChange("sku", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label>Barcode</Label>
            <Input placeholder="Barcode" value={formData.barcode} onChange={e => handleChange("barcode", e.target.value)} />
          </div>
        </div>

        {/* Pricing & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <Label>Selling Price</Label>
            <Input type="number" placeholder="Selling Price" value={formData.sellingPrice} onChange={e => handleChange("sellingPrice", parseFloat(e.target.value))} />
          </div>
          <div className="flex flex-col">
            <Label>Cost Price</Label>
            <Input type="number" placeholder="Cost Price" value={formData.costPrice} onChange={e => handleChange("costPrice", parseFloat(e.target.value))} />
          </div>
          <div className="flex flex-col">
            <Label>Unit</Label>
            <Input placeholder="Unit" value={formData.unit} onChange={e => handleChange("unit", e.target.value)} />
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <Label>Weight</Label>
            <Input type="number" value={formData.weight} onChange={e => handleChange("weight", parseFloat(e.target.value))} />
          </div>
          <div className="flex flex-col">
            <Label>Length</Label>
            <Input type="number" value={formData.length} onChange={e => handleChange("length", parseFloat(e.target.value))} />
          </div>
          <div className="flex flex-col">
            <Label>Width</Label>
            <Input type="number" value={formData.width} onChange={e => handleChange("width", parseFloat(e.target.value))} />
          </div>
          <div className="flex flex-col">
            <Label>Height</Label>
            <Input type="number" value={formData.height} onChange={e => handleChange("height", parseFloat(e.target.value))} />
          </div>
        </div>

        {/* Tax & Expiry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label>Tax Rate (%)</Label>
            <Input type="number" value={formData.taxRate} onChange={e => handleChange("taxRate", parseFloat(e.target.value))} />
          </div>
          <div className="flex flex-col">
            <Label>Expiry Date</Label>
            <Input type="date" value={formData.expiryDate} onChange={e => handleChange("expiryDate", e.target.value)} />
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col">
          <Label>Variant Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imageFile && (
            <img src={imageFile} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
          )}
          {formData.imageUrl && !imageFile && (
            <img src={formData.imageUrl} alt="Current" className="mt-2 w-32 h-32 object-cover rounded border" />
          )}
        </div>

        {/* Flags */}
        <div className="flex gap-6 items-center">
          <Checkbox checked={formData.isActive} onCheckedChange={val => handleChange("isActive", val)}>Active</Checkbox>
          <Checkbox checked={formData.isFeatured} onCheckedChange={val => handleChange("isFeatured", val)}>Featured</Checkbox>
        </div>

        <Button type="submit" className="w-full">{variant ? "Update Variant" : "Create Variant"}</Button>
      </form>
    </div>
  );
}
