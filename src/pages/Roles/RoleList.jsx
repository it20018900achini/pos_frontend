// src/components/roles/RoleList.jsx
import React from "react";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/Redux Toolkit/features/role/roleApi";

const RoleList = ({ onEdit }) => {
  const { data: roles, isLoading } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  if (isLoading) return <p>Loading roles...</p>;

  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Permissions</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {roles?.map((role) => (
          <tr key={role.id} className="border-t">
            <td>{role.id}</td>
            <td>{role.name}</td>
            <td>{role.permissions?.map(p => p.name).join(", ")}</td>
            <td className="flex gap-2">
              <button
                className="text-blue-500"
                onClick={() => onEdit(role.id)}
              >
                Edit
              </button>
              <button
                className="text-red-500"
                onClick={() => deleteRole(role.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoleList;
