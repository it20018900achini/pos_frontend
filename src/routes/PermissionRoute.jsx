import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PermissionRoute = ({ permission, children }) => {
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const user = userProfile?.user;

  const selectedBranch =
    user?.roleBranchMap?.find(
      (b) => b.branchId === Number(selectedBranchId)
    ) || user?.defaultBranch;

  const permissions = selectedBranch?.permissions || [];

  if (!permissions.includes(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PermissionRoute;