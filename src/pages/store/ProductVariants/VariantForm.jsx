"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  useCreateProductVariantMutation, 
  useUpdateProductVariantMutation 
} from "../../../Redux Toolkit/features/product/productApi";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, UploadCloud, ImageIcon, Star } from "lucide-react";

export default function VariantForm({ variant = null, onSuccess, defaultProductId = null }) {
  // Redux state for the product list
  const { products } = useSelector((state) => state.product);

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

  const [isUploading, setIsUploading] = useState(false);
  const [createVariant, { isLoading: isCreating }] = useCreateProductVariantMutation();
  const [updateVariant, { isLoading: isUpdating }] = useUpdateProductVariantMutation();

  useEffect(() => {
    if (variant) {
      setFormData({ ...variant });
    } else if (defaultProductId) {
      // If we filtered by a product in the main page, pre-select it here
      setFormData(prev => ({ ...prev, productId: defaultProductId.toString() }));
    }
  }, [variant, defaultProductId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const uploadedUrl = await uploadToCloudinary(file);
        handleChange("imageUrl", uploadedUrl);
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (variant?.id) {
        await updateVariant({ id: variant.id, ...formData }).unwrap();
      } else {
        await createVariant(formData).unwrap();
      }
      onSuccess?.();
    } catch (err) {
      console.error("Failed to save variant", err);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      
      {/* --- SECTION 1: IDENTITY --- */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product">Parent Product</Label>
            <Select 
              value={formData.productId?.toString()} 
              onValueChange={(val) => handleChange("productId", val)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select base product" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Variant Name</Label>
            <Input
              id="name"
              placeholder="e.g. White Bread - 500g"
              value={formData.name}
              onChange={e => handleChange("name", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>SKU Number</Label>
            <Input placeholder="Stock Keeping Unit" value={formData.sku} onChange={e => handleChange("sku", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Barcode</Label>
            <Input placeholder="EAN/UPC Code" value={formData.barcode} onChange={e => handleChange("barcode", e.target.value)} />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: PRICING & STOCK --- */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pricing & Logistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Selling Price ($)</Label>
            <Input type="number" step="0.01" value={formData.sellingPrice} onChange={e => handleChange("sellingPrice", parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Cost Price ($)</Label>
            <Input type="number" step="0.01" value={formData.costPrice} onChange={e => handleChange("costPrice", parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input type="number" value={formData.taxRate} onChange={e => handleChange("taxRate", parseFloat(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input type="number" step="0.1" value={formData.weight} onChange={e => handleChange("weight", parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Length (cm)</Label>
            <Input type="number" value={formData.length} onChange={e => handleChange("length", parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Width (cm)</Label>
            <Input type="number" value={formData.width} onChange={e => handleChange("width", parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Height (cm)</Label>
            <Input type="number" value={formData.height} onChange={e => handleChange("height", parseFloat(e.target.value))} />
          </div>
        </div>
      </div>

      {/* --- SECTION 3: MEDIA & STATUS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
        <div className="space-y-4">
          <Label>Variant Image</Label>
          <div className="relative group border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center hover:bg-muted/50 transition-all">
            {isUploading ? (
              <div className="flex flex-col items-center py-6">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-xs mt-2 text-muted-foreground">Uploading to Cloud...</p>
              </div>
            ) : formData.imageUrl ? (
              <div className="relative">
                <img src={formData.imageUrl} alt="Preview" className="w-40 h-40 object-cover rounded-lg shadow-md border" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-lg transition-opacity">
                   <Label className="cursor-pointer text-white text-xs font-bold flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" /> Change
                    <Input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                   </Label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center py-6 cursor-pointer w-full">
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs text-muted-foreground">PNG, JPG or WebP</span>
                <Input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Input type="date" value={formData.expiryDate} onChange={e => handleChange("expiryDate", e.target.value)} />
          </div>

          <div className="flex flex-col gap-4 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={val => handleChange("isActive", val)} />
              <Label htmlFor="isActive" className="cursor-pointer">Publish this variant (Active)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isFeatured" checked={formData.isFeatured} onCheckedChange={val => handleChange("isFeatured", val)} />
              <Label htmlFor="isFeatured" className="cursor-pointer font-semibold text-primary flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary" /> Feature on homepage
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button type="button" variant="outline" className="flex-1" onClick={() => onSuccess?.()}>Cancel</Button>
        <Button type="submit" className="flex-[2]" disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            variant ? "Update Variant" : "Create Variant"
          )}
        </Button>
      </div>
    </form>
  );
}

// Utility icon for the change state
function RefreshCcw(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
  )
}