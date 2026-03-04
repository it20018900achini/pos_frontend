// src/pages/userRoles/UserRoleList.jsx
import React from "react";
import {
  useGetAllUserRolesQuery,
  useDeleteUserRoleMutation,
} from "@/Redux Toolkit/features/role/roleApi";

const UserRoleList = () => {
  const { data, isLoading } = useGetAllUserRolesQuery();
  const [deleteUserRole] = useDeleteUserRoleMutation();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All User Roles</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Branch</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.user?.username}</td>
              <td className="border p-2">{item.role?.name}</td>
              <td className="border p-2">{item.branch?.name}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteUserRole(item.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleList;