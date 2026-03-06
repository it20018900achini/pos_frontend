import React from "react";
import { useSelector } from "react-redux";
import DateRangeFilter from "./DateRangeFilter";

const ContentLayout = ({
  title,
  subTitle,
  right,
  dateRange,
  requiredPermission, // the permission required to access this page
  children,
}) => {
  const userProfile = useSelector(
    (state) => state.user?.userProfile?.user
  );
  const selectedBranchId = useSelector(
    (state) => state.user?.selectedBranchId
  );

  // Find branch permissions
  const branchPermissions =
    userProfile?.roleBranchMap?.find(
      (b) => b.branchId === Number(selectedBranchId)
    )?.permissions || [];

  const hasAccess =
    !requiredPermission || branchPermissions.includes(requiredPermission);

  return (
    <div className="min-h-screen bg-background ml-20 md:ml-0">
      {/* Header */}
      {(title || right) && (
        <div className="bg-muted border-b flex flex-col md:flex-row items-start md:items-center justify-between w-full">
          {title && (
            <div className="px-6 py-4">
              {typeof title === "string" ? (
                <h1 className="text-2xl font-bold">{title}</h1>
              ) : (
                title
              )}
              {subTitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subTitle}
                </p>
              )}
            </div>
          )}

          {hasAccess && right && (
            <div className="px-6 py-4 flex flex-wrap items-center gap-3">
              {right}
            </div>
          )}
         
        </div>
      )}
      {dateRange&& <DateRangeFilter/>}

      {/* Content */}
      <div className="p-6">
        {hasAccess ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-semibold text-destructive">
              Access Denied
            </h2>
            <p className="text-muted-foreground mt-2">
              You do not have permission to access this page for this branch.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLayout;