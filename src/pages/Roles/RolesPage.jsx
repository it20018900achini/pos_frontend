// src/pages/RolesPage.jsx
import React, { useState } from "react";
import RoleForm from "./RoleForm";
import RoleList from "./RoleList";

const RolesPage = () => {
  const [editingRoleId, setEditingRoleId] = useState(null);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Role Management</h1>

      <RoleForm
        roleId={editingRoleId}
        onSuccess={() => setEditingRoleId(null)}
      />

      <RoleList
        onEdit={(id) => setEditingRoleId(id)}
      />
    </div>
  );
};

export default RolesPage;
