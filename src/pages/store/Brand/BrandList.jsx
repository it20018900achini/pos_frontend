import { useState } from "react";
import BrandForm from "./BrandForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  useDeleteBrandMutation,
  useGetBrandsByStoreQuery,
  useUpdateBrandMutation,
} from "../../../Redux Toolkit/features/brand/brandApi";

export default function BrandList({ storeId }) {
  const [editingBrand, setEditingBrand] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [page, setPage] = useState(0);
  const size = 10;

  // Fetch brands paginated
  const { data, refetch, isLoading } = useGetBrandsByStoreQuery(
    { storeId, page, size },
    { refetchOnMountOrArgChange: true }
  );

  const brands = data?.content || [];
  const pagination = {
    first: data?.first ?? true,
    last: data?.last ?? true,
    pageNumber: data?.number ?? 0,
    totalPages: data?.totalPages ?? 1,
  };

  const [deleteBrand] = useDeleteBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  const openDialog = (brand = null) => {
    setEditingBrand(brand);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setEditingBrand(null);
    setShowDialog(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    await deleteBrand(id).unwrap();
    refetch();
  };

  const toggleActive = async (brand) => {
    await updateBrand({ id: brand.id, dto: { ...brand, isActive: !brand.isActive } }).unwrap();
    refetch();
  };

  if (isLoading) return <p>Loading brands...</p>;

  return (
    <div className="space-y-4">
      {/* Dialog for Create/Edit */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "Create Brand"}</DialogTitle>
          </DialogHeader>
          <BrandForm
            storeId={storeId}
            brand={editingBrand}
            onSuccess={() => {
              closeDialog();
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Button to open create form */}
      <Button onClick={() => openDialog()}>Create New Brand</Button>
{/* <pre>
    {JSON.stringify(data,null,2)}
</pre> */}
      {/* Brand List */}
      {data?.brands.length === 0 && !isLoading && <p>No brands found.</p>}

      {data?.brands.map((b) => (
        <Card key={b.id} className="flex justify-between items-center p-4">
          <CardContent>
            <p className="font-bold">{b.name}</p>
            <p>{b.description}</p>
            <p>Status: {b.isActive ? "Active" : "Inactive"}</p>
          </CardContent>
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => openDialog(b)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(b.id)}>Delete</Button>
            <Button size="sm" variant="outline" onClick={() => toggleActive(b)}>
              {b.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </Card>
      ))}

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={pagination.first}>
          Previous
        </Button>
        <span className="px-2 py-1">{pagination.pageNumber + 1}</span>
        <Button onClick={() => setPage((p) => p + 1)} disabled={pagination.last}>
          Next
        </Button>
      </div>
    </div>
  );
}
