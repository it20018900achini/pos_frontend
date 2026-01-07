// src/pages/store/Brand/BrandForm.jsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // ✅ Shadcn switch

import { useCreateBrandMutation, useUpdateBrandMutation } from "../../../Redux Toolkit/features/brand/brandApi";

export default function BrandForm({ storeId, brand = null, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    logoUrl: "",
    isActive: true,
  });

  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();

  useEffect(() => {
    if (brand) setForm({ ...brand });
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (checked) => {
    setForm((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (brand?.id) {
        await updateBrand({ id: brand.id, dto: form }).unwrap();
        alert("✅ Brand updated successfully");
      } else {
        await createBrand({ ...form, storeId }).unwrap();
        alert("✅ Brand created successfully");
      }
      setForm({ name: "", description: "", logoUrl: "", isActive: true });
      onSuccess?.();
    } catch (err) {
      console.error("BrandForm Error:", err);
      alert("❌ Error: " + (err?.data?.message || err.message));
    }
  };

  return (
   
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              value={form.logoUrl}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Switch checked={form.isActive} onCheckedChange={handleSwitch} />
            <Label>Active</Label>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={creating || updating}>
            {brand
              ? updating
                ? "Updating..."
                : "Update Brand"
              : creating
              ? "Creating..."
              : "Create Brand"}
          </Button>
        </CardFooter>
      </form>
  
  );
}
