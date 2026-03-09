"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContentLayout from "../../Dashboard/ContentLayout";
import VariantForm from "./VariantForm";
import { useDeleteProductVariantMutation, useFilterProductVariantsQuery } from "../../../Redux Toolkit/features/product/productApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductVariantsPage() {
  const { selectedBranchId } = useSelector((state) => state.user);

  // Local state
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ isActive: null, isFeatured: null });
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVariant, setEditVariant] = useState(null);

  // Build query params
  const queryParams = {
    branchId: selectedBranchId,
    keyword: search || undefined,
    page,
    size: 10,
    sortBy: "id",
    sortDir: "asc",
    ...(filters.isActive !== null && { isActive: filters.isActive }),
    ...(filters.isFeatured !== null && { isFeatured: filters.isFeatured }),
  };

  // API calls
  const { data, isLoading } = useFilterProductVariantsQuery(queryParams);
  const [deleteVariant] = useDeleteProductVariantMutation();

  // Modal handlers
  const openModal = (variant = null) => {
    setEditVariant(variant);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditVariant(null);
    setIsModalOpen(false);
  };

  // Apply filters
  const handleApplyFilters = () => setPage(0);

  return (
    <ContentLayout title="Product Variants" subTitle="Manage your variants per branch" right={
      <Button onClick={() => openModal()}>+ Add Variant</Button>
    }>
      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar Filters */}
        <div className="w-full md:w-64 p-4 border rounded space-y-4">
          <h2 className="font-bold text-lg">Filters</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />

          {/* Active Filter */}
          <div>
            <label className="block mb-1 font-medium">Active</label>
            <Select
              value={filters.isActive ?? "any"}
              onValueChange={(val) =>
                setFilters((f) => ({ ...f, isActive: val === "any" ? null : val === "yes" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block mb-1 font-medium">Featured</label>
            <Select
              value={filters.isFeatured ?? "any"}
              onValueChange={(val) =>
                setFilters((f) => ({ ...f, isFeatured: val === "any" ? null : val === "yes" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>

        {/* Main Table */}
        <div className="flex-1 flex flex-col">
          <div className="overflow-x-auto border rounded">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
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
                      <Button size="sm" variant="outline" onClick={() => openModal(variant)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteVariant(variant.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Loading */}
            {isLoading && <div className="p-4">Loading...</div>}

            {/* Pagination */}
            <div className="mt-4 flex gap-2 justify-end">
              <Button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button disabled={page + 1 >= data?.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Variant Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="overflow-auto max-h-screen">
          <DialogHeader>
            <DialogTitle>{editVariant ? "Edit Variant" : "Create Variant"}</DialogTitle>
          </DialogHeader>
          <VariantForm variant={editVariant} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}