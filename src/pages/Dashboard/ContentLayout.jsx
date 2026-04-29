"use client";

import React from "react";
import { useSelector } from "react-redux";
import DateRangeFilter from "./DateRangeFilter";
import { Loader2 } from "lucide-react"; // Import Loader2 for the inner sync icon

const ContentLayout = ({
  title,
  subTitle,
  right,
  dateRange,
  requiredPermission,
  children,
  loadingSpinner = false,
}) => {
  const { userProfile, selectedBranchId, branchLoading } = useSelector((state) => state.user);

  const branchPermissions =
    userProfile?.user?.roleBranchMap?.find(
      (b) => b.branchId === Number(selectedBranchId)
    )?.permissions || [];

  const hasAccess =
    !requiredPermission || branchPermissions.includes(requiredPermission);

  return (
    <div className="min-h-screen bg-background ml-20 md:ml-0 transition-colors duration-300">
      {/* Header */}
      {(title || right) && (
        <div className="bg-muted/50 backdrop-blur-sm border-b flex flex-col md:flex-row items-start md:items-center justify-between w-full transition-all">
          {title && (
            <div className="px-6 py-4">
              {typeof title === "string" ? (
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              ) : (
                title
              )}
              {subTitle && (
  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
    <span className="relative border border-green-300 dark:border-green-800 px-2 py-0.5 rounded text-green-700 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30 font-medium transition-colors">
      {branchLoading && (
        <span className="absolute -left-5 top-1">
          <Loader2 className="w-3 h-3 animate-spin text-green-600 dark:text-green-400" />
        </span>
      )}
      {userProfile?.user?.roleBranchMap?.find(
        (b) => b.branchId === Number(selectedBranchId)
      )?.branchName}
    </span>{" "}
    {subTitle}
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

      {/* --- PREMIUM LOADING STATE --- */}
      {loadingSpinner || branchLoading ? (
        <div
          className="flex flex-col items-center justify-center gap-6"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          <div className="relative flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <div className="h-16 w-16 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
            {/* Inner Pulsing Core */}
            <div className="absolute h-8 w-8 bg-primary/20 rounded-full animate-pulse" />
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
              Syncing Data
            </p>
            <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
               <div className="h-full bg-primary animate-progress-origin w-1/2 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ContentLayout;