// src/pages/userRoles/UserRolesByBranch.jsx
import React from "react";
import { useGetUserRolesByUserAndBranchQuery } from "@/Redux Toolkit/features/role/roleApi";
import { useSelector } from "react-redux";

const UserRolesByBranch = () => {
      const { userProfile, selectedBranchId } = useSelector((state) => state.user);
    
    const userId = userProfile?.id ;
    const branchId = selectedBranchId;
  const { data, isLoading } =
    useGetUserRolesByUserAndBranchQuery({ userId, branchId });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>--
        {JSON.stringify(data)}
      {data?.map((item) => (
        <div key={item.id} className="border p-3 mb-2">
          <p>Role: {item.role?.name}</p>
          <p>Branch: {item.branch?.name}</p>
        </div>
      ))}--
    </div>
  );
};

export default UserRolesByBranch;