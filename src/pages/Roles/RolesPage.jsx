import React, { useState } from "react";
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

  return (
    <ContentLayout title="Role Management" subTitle="Create and manage user roles and permissions." right={        <Button onClick={openCreate}>Add Role</Button>
      } >
    <div className="p-4 space-y-6">
     

      <RoleList onEdit={openEdit} />

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRoleId ? "Edit Role" : "Create Role"}
            </DialogTitle>
          </DialogHeader>

          <RoleForm
            roleId={editingRoleId}
            onSuccess={() => {
              setOpen(false);
              setEditingRoleId(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
    </ContentLayout>
  );
};

export default RolesPage;
