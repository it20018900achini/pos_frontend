import React, { useState } from "react";
import VariantForm from "./VariantForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteProductVariantMutation, useFilterProductVariantsQuery } from "../../../Redux Toolkit/features/product/productApi";

export default function ProductVariantsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ isActive: null, isFeatured: null });
  const [page, setPage] = useState(0);
  const [editVariant, setEditVariant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build query params dynamically to avoid sending null
  const queryParams = {
    keyword: search || undefined,
    page,
    size: 10,
    sortBy: "id",
    sortDir: "asc",
  };

  if (filters.isActive !== null) queryParams.isActive = filters.isActive;
  if (filters.isFeatured !== null) queryParams.isFeatured = filters.isFeatured;

  const { data, isLoading } = useFilterProductVariantsQuery(queryParams);

  const [deleteVariant] = useDeleteProductVariantMutation();

  const openModal = (variant = null) => {
    setEditVariant(variant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditVariant(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 flex gap-6">
      {/* Sidebar Filters */}
      <div className="w-64 p-4 border rounded space-y-4">
        <h2 className="font-bold text-lg">Filters</h2>

        <Input
          placeholder="Search by name or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Active Checkbox */}
        <Checkbox
          checked={filters.isActive ?? false}
          onCheckedChange={(val) =>
            setFilters((f) => ({
              ...f,
              isActive: val === null ? null : val, // null-safe
            }))
          }
        >
          Active
        </Checkbox>

        {/* Featured Checkbox */}
        <Checkbox
          checked={filters.isFeatured ?? false}
          onCheckedChange={(val) =>
            setFilters((f) => ({
              ...f,
              isFeatured: val === null ? null : val,
            }))
          }
        >
          Featured
        </Checkbox>

        {/* Apply Filters */}
        <Button onClick={() => setPage(0)}>Apply Filters</Button>
      </div>

      {/* Main Table */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Product Variants</h2>
          <Button onClick={() => openModal()}>+ Add Variant</Button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">SKU</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((variant) => (
              <tr key={variant.id} className="hover:bg-gray-50">
                <td className="border p-2">{variant.id}</td>
                <td className="border p-2">{variant.name}</td>
                <td className="border p-2">{variant.sku}</td>
                <td className="border p-2">{variant.sellingPrice}</td>
                <td className="border p-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(variant)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteVariant(variant.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex gap-2">
          <Button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <Button
            disabled={page + 1 >= data?.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="overflow-auto max-h-screen">
          <DialogHeader>
            <DialogTitle>{editVariant ? "Edit Variant" : "Create Variant"}</DialogTitle>
          </DialogHeader>
          <VariantForm variant={editVariant} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
