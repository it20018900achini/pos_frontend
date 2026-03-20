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
  loadingSpinner = false, // use prop to control spinner
}) => {


  const { userProfile, selectedBranchId,branchLoading   } = useSelector((state) => state.user);

  // Show spinner if loadingSpinner prop is true
  

  // Find branch permissions
  const branchPermissions =
    userProfile?.user?.roleBranchMap?.find(
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
                 <span className=" relative border border-green-300 px-2 text-green-600 bg-green-200">
                  {
                    branchLoading&&<span class="absolute w-10 -left-4 top-1">
  <div class="w-3 h-3 border-1 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
</span>
                  }
                  
                
                  {userProfile?.user?.roleBranchMap?.find(
      (b) => b.branchId === Number(selectedBranchId)
    )?.branchName}</span> {subTitle}
                </p>
              )}
            </div>
          )}

          {hasAccess && right && !loadingSpinner && (
            <div className="px-6 py-4 flex flex-wrap items-center gap-3">
              {right}
            </div>
          )}
        </div>
      )}


  {loadingSpinner || branchLoading ? (
  <div
    className="flex items-center justify-center"
    style={{ minHeight: "calc(100vh - 200px)" }} // subtract 400px from full viewport height
  >
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
  </div>
):<>

      {dateRange && <DateRangeFilter />}

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

</>}

    </div>
  );
};

export default ContentLayout;