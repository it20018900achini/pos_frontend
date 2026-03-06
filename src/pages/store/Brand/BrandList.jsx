import { useState } from "react";
import BrandForm from "./BrandForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  useDeleteBrandMutation,
  useGetBrandsByStoreQuery,
  useUpdateBrandMutation,
} from "../../../Redux Toolkit/features/brand/brandApi";
import { useSelector } from "react-redux";
import ContentLayout from "../../Dashboard/ContentLayout";

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

  const { userProfile } = useSelector((state) => state.user);

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


  return (
    <ContentLayout loadingSpinner={isLoading} title="Brands" subTitle="Manage your store's brands here." right={
              <Button onClick={() => openDialog()}>Create New Brand</Button>

    }>
    <div className="space-y-4">

      {/* Dialog for Create/Edit */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "Create Brand"}</DialogTitle>
          </DialogHeader>
          <BrandForm
            storeId={userProfile?.user?.storeId}
            brand={editingBrand}
            onSuccess={() => {
              closeDialog();
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      

      {/* Brand Cards */}
      {data?.brands?.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground">No brands found.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.brands.map((b) => (
          <Card key={b.id} className="flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition">
            <div className="space-y-2">
              <p className="text-lg font-bold">{b.name}</p>
              <p className="text-sm text-muted-foreground">{b.description}</p>
              <Badge variant={b.isActive ? "default" : "secondary"}>
                {b.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => openDialog(b)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(b.id)}>Delete</Button>
              <Button size="sm" variant="ghost" onClick={() => toggleActive(b)}>
                {b.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data?.brands?.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={pagination.first}>
            Previous
          </Button>
          <span className="px-2 py-1 text-sm">
            Page {pagination.pageNumber + 1} of {pagination.totalPages}
          </span>
          <Button onClick={() => setPage((p) => p + 1)} disabled={pagination.last}>
            Next
          </Button>
        </div>
      )}
    </div>
    </ContentLayout>
  );
}