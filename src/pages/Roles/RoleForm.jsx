// src/components/roles/RoleForm.jsx
import React, { useState, useEffect } from "react";
import { useCreateRoleMutation, useGetRoleByIdQuery, useUpdateRoleMutation } from "../../Redux Toolkit/features/role/roleApi";
import { useGetPermissionsQuery } from "../../Redux Toolkit/features/role/permissionApi";

const RoleForm = ({ roleId, onSuccess }) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data: role } = useGetRoleByIdQuery(roleId, { skip: !roleId });
  const { data: permissions } = useGetPermissionsQuery();

  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions?.map(p => p.id) || []);
    }
  }, [role]);

  const handlePermissionChange = (id) => {
    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      permissions: selectedPermissions.map(id => ({ id })),
    };

    try {
      if (roleId) {
        await updateRole({ id: roleId, ...payload }).unwrap();
      } else {
        await createRole(payload).unwrap();
      }
      setName("");
      setSelectedPermissions([]);
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role Name"
        className="border p-2 w-full"
        required
      />

      <div>
        <label className="font-semibold">Permissions:</label>
        <div className="flex flex-wrap gap-2 mt-1">
         - {JSON.stringify(permissions)}-
          {permissions?.map((perm) => (
            <label key={perm.id} className="border rounded px-2 py-1">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm.id)}
                onChange={() => handlePermissionChange(perm.id)}
                className="mr-1"
              />
              {perm.name}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        {roleId ? (updating ? "Updating..." : "Update Role") : creating ? "Creating..." : "Create Role"}
      </button>
    </form>
  );
};

export default RoleForm;
