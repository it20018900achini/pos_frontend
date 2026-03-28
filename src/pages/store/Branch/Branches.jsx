"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getAllBranchesByStore,
  deleteBranch,
} from "@/Redux Toolkit/features/branch/branchThunks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import BranchForm from "./BranchForm";
import ContentLayout from "../../Dashboard/ContentLayout";
import ReusableTable from "../../common/ReusableTable";
import DeleteButton from "./DeleteButton";

export default function Branches() {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  const { branches = [], loading, error } = useSelector((state) => state.branch);
  const { store } = useSelector((state) => state.store);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    if (userProfile?.user?.store?.id) {
      dispatch(
        getAllBranchesByStore({
          storeId: userProfile?.user?.store?.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [dispatch, userProfile]);

  const handleAddBranchSuccess = () => setIsAddDialogOpen(false);
  const handleEditBranchSuccess = () => {
    setIsEditDialogOpen(false);
    setCurrentBranch(null);
  };

  const openEditDialog = (branch) => {
    setCurrentBranch(branch);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBranch = async (id) => {
    try {
      const jwt = localStorage.getItem("jwt");
      await dispatch(deleteBranch({ id, jwt })).unwrap();
      toast({ title: "Success", description: "Branch deleted successfully" });
      dispatch(getAllBranchesByStore({ storeId: userProfile?.user?.store?.id, jwt }));
    } catch (err) {
      console.error(err);
    }
  };

  const branchColumns = [
    { header: "Branch Name", accessor: "name", sortable: true },
    { header: "Address", accessor: "address", sortable: true },
    { header: "Manager", accessor: "manager" },
    { header: "Phone", accessor: "phone" },
  ];

  const branchData = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    address: branch.address,
    manager: branch.manager || "Not Assigned",
    phone: branch.phone,
  }));

  return (
    <ContentLayout
      loadingSpinner={loading}
      title="Branch Management"
      subTitle="Manage your store branches."
      right={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
            </DialogHeader>
            <BranchForm onSubmit={handleAddBranchSuccess} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
            </DialogHeader>
            <BranchForm
              initialValues={currentBranch}
              onSubmit={handleEditBranchSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>

        <ReusableTable
          columns={branchColumns}
          data={branchData}
          loading={loading}
          // FIX 1: Use isServer={false} to trigger client filtering
          isServer={false} 
          enableSearch={true}
          // FIX 2: Pass both filters and setFilters
          filters={filters}
          setFilters={setFilters}
          onFilter={(updatedFilters) => setFilters({ ...updatedFilters, page: 0 })}
          // FIX 3: Corrected actions layout
          actions={(row) => (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(row)}>
                <Edit className="h-4 w-4" />
              </Button>
              <DeleteButton
                rowId={row.id}
                handleDeleteBranch={handleDeleteBranch}
                loading={loading}
              />
            </div>
          )}
        />
      </div>
    </ContentLayout>
  );
}