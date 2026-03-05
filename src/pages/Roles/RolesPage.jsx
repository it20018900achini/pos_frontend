import React, { useState, Suspense } from "react";
import RoleForm from "./RoleForm";
import RoleList from "./RoleList";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import ContentLayout from "../Dashboard/ContentLayout";

/* Skeleton Loader */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

const RolesPage = () => {
  const [open, setOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);

  const openCreate = () => {
    setEditingRoleId(null);
    setOpen(true);
  };

  const openEdit = (id) => {
    setEditingRoleId(id);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingRoleId(null);
  };

  return (
    <ContentLayout
      title="Role Management"
      subTitle="Create and manage user roles and permissions."
      right={<Button onClick={openCreate}>Add Role</Button>}
    >
      <div className="p-4 space-y-6">

        {/* Role List with Skeleton */}
        <Suspense
          fallback={
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          }
        >
          <RoleList onEdit={openEdit} />
        </Suspense>

        {/* MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingRoleId ? "Edit Role" : "Create Role"}
              </DialogTitle>
            </DialogHeader>

            {/* Form Skeleton */}
            <Suspense
              fallback={
                <div className="space-y-4 py-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
              }
            >
              <RoleForm roleId={editingRoleId} onSuccess={closeModal} />
            </Suspense>

          </DialogContent>
        </Dialog>

      </div>
    </ContentLayout>
  );
};

export default RolesPage;