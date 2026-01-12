import React, { useState } from "react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteProductVariantMutation, useFilterProductVariantsQuery } from "../../../Redux Toolkit/features/product/productApi";

export default function ProductVariantList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useFilterProductVariantsQuery({
    keyword: search,
    page,
    size: 10,
    sortBy: "id",
    sortDir: "asc",
  });

  const [deleteVariant] = useDeleteProductVariantMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex mb-4 gap-2">
        <Input
          placeholder="Search variants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setPage(0)}>Search</Button>
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
                  onClick={() => alert("Edit form modal not implemented yet")}
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
  );
}
