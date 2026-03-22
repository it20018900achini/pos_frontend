"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Edit, Trash2, Power, PowerOff, Plus } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Custom Components
import ContentLayout from "../../Dashboard/ContentLayout";
import BrandForm from "./BrandForm";

// API
import {
  useDeleteBrandMutation,
  useGetBrandsByStoreQuery,
  useUpdateBrandMutation,
} from "../../../Redux Toolkit/features/brand/brandApi";
import { toast } from "sonner";
import ReusableTable from "../../common/ReusableTable";

export default function BrandList({ storeId }) {
  const { userProfile } = useSelector((state) => state.user);

  // Table & Modal State
  const [editingBrand, setEditingBrand] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ search: "" });
  const size = 10;

  // Fetch Brands
  const { data, refetch, isLoading } = useGetBrandsByStoreQuery(
    { storeId, page, size },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteBrand] = useDeleteBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  // Columns Definition
  const columns = [
    { header: "Brand Name", accessor: "name", sortable: true },
    { header: "Description", accessor: "description" },
    { 
      header: "Status", 
      accessor: "isActive", 
      type: "custom", 
      render: (val) => (
        <Badge variant={val ? "default" : "secondary"}>
          {val ? "Active" : "Inactive"}
        </Badge>
      ) 
    },
  ];

  // Handlers
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
    try {
      await deleteBrand(id).unwrap();
      toast({ title: "Deleted", description: "Brand removed successfully" });
      refetch();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete brand", variant: "destructive" });
    }
  };

  const toggleActive = async (brand) => {
    try {
      await updateBrand({ id: brand.id, dto: { ...brand, isActive: !brand.isActive } }).unwrap();
      toast({ title: "Updated", description: `Brand ${brand.isActive ? 'deactivated' : 'activated'}` });
      refetch();
    } catch (err) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    }
  };

  // Actions column renderer
  const renderActions = (brand) => (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openDialog(brand)}>
        <Edit size={14} />
      </Button>
      <Button 
        size="icon" 
        variant="ghost" 
        className={`h-8 w-8 ${brand.isActive ? 'text-orange-500' : 'text-green-500'}`} 
        onClick={() => toggleActive(brand)}
      >
        {brand.isActive ? <PowerOff size={14} /> : <Power size={14} />}
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(brand.id)}>
        <Trash2 size={14} />
      </Button>
    </div>
  );

  return (
    <ContentLayout 
      title="Brands" 
      subTitle="Manage your store's brands and manufacturers" 
      right={
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus size={16} /> Create Brand
        </Button>
      }
    >
      <div className="bg-card rounded-xl border shadow-sm p-4">
        <ReusableTable
          columns={columns}
          data={data?.brands || []}
          loading={isLoading}
          isServer={true} // Set to true since you're using paginated API
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={(newPage) => setPage(newPage)}
          // enableSearch={true}
          filters={filters}
          setFilters={setFilters}
          actions={renderActions}
        />
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Update Brand" : "Add New Brand"}</DialogTitle>
          </DialogHeader>
          <BrandForm
            storeId={storeId || userProfile?.user?.storeId}
            brand={editingBrand}
            onSuccess={() => {
              closeDialog();
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}