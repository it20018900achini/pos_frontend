import React, { useState, useEffect } from "react";
import {
  useCreateRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../Redux Toolkit/features/role/roleApi";
import { useGetPermissionsQuery } from "../../Redux Toolkit/features/role/permissionApi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const RoleForm = ({ roleId, onSuccess }) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data: role } = useGetRoleByIdQuery(roleId, { skip: !roleId });
  const { data: permissions = [], isLoading } = useGetPermissionsQuery();

  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
    }
  }, [role]);

  useEffect(() => {
    if (!roleId) {
      setName("");
      setSelectedPermissions([]);
    }
  }, [roleId]);

  const togglePermission = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      permissions: selectedPermissions.map((id) => ({ id })),
    };

    try {
      if (roleId) {
        await updateRole({ id: roleId, ...payload }).unwrap();
      } else {
        await createRole(payload).unwrap();
      }
      onSuccess?.();
    } catch (err) {
      console.error("Failed to save role", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Name */}
      <div>
        <label className="text-sm font-medium">Role Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. BRANCH_ADMIN"
          required
        />
      </div>

      {/* Permissions */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Permissions
        </label>

        <ScrollArea className="h-48 border rounded-md p-2">
          <div className="space-y-2">
            {isLoading && <p className="text-sm text-muted">Loading...</p>}

            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  checked={selectedPermissions.includes(perm.id)}
                  onCheckedChange={() => togglePermission(perm.id)}
                />
                <span className="text-sm">{perm.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={creating || updating}>
          {roleId
            ? updating
              ? "Updating..."
              : "Update Role"
            : creating
            ? "Creating..."
            : "Create Role"}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;
