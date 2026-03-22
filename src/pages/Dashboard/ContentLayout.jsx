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
                  <span className="group relative inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300
  /* Light Mode: Emerald/Mint palette */
  bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm
  /* Dark Mode: Deep Forest glow */
  dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
  
  {branchLoading ? (
    <Loader2 className="w-3 h-3 animate-spin text-emerald-600 dark:text-emerald-400" />
  ) : (
    /* Subtle dot indicator for a "Live/Active" look */
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  )}

  <span className="truncate max-w-[150px]">
    {userProfile?.user?.roleBranchMap?.find(
      (b) => b.branchId === Number(selectedBranchId)
    )?.branchName || "Select Branch"}
  </span>

  {/* Subtle hover shine effect */}
  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
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