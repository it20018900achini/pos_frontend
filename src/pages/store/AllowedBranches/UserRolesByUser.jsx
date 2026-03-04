// src/pages/userRoles/UserRolesByUser.jsx
import React from "react";
// import { useParams } from "react-router-dom";
import {
  useGetUserRolesByUserQuery,
  useDeleteUserRoleMutation,
} from "@/Redux Toolkit/features/role/roleApi";

const UserRolesByUser = () => {
  const  userId  = 12;
  const { data, isLoading } = useGetUserRolesByUserQuery(userId);
  const [deleteUserRole] = useDeleteUserRoleMutation();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Roles for User ID: {userId}
      </h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Branch</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Permissions</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.branchName}</td>
              <td className="border p-2">{item.role.name}</td>
              <td className="border p-2">
                {item.role.permissions?.join(", ")}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => deleteUserRole(item.id)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRolesByUser;