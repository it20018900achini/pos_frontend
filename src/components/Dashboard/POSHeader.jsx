import React, { useEffect } from "react";
import { useSidebar } from "@/context/hooks/useSidebar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { settings } from "@/constant";
import { ThemeToggle } from "../theme-toggle";
import { setSelectedBranch } from "@/Redux Toolkit/features/user/userSlice"; // adjust path

const POSHeader = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, selectedBranchId } = useSelector(
    (state) => state.user
  );

  const { branches } = useSelector((state) => state.branch);

  const user = userProfile?.user;
  const fullName = user?.fullName || "User";
  const role =
    user?.roles?.map((r) => r.replace(/_/g, " "))?.join(", ") || "";

  const selectedBranch = branches?.find(
    (b) => b.id === selectedBranchId
  );

  const branchName = selectedBranch?.name || "Select Branch";
  const storeName = selectedBranch?.store?.brand || "";

  /* ---------------- Keyboard Shortcuts ---------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.key === "F10") setSidebarOpen(true);
      if (e.key === "F9") setSidebarOpen(false);

      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "o":
            navigate("/cashier/orders");
            break;
          case "c":
            navigate("/cashier/customers");
            break;
          case "d":
            navigate("/cashier");
            break;
          case "r":
            navigate("/cashier/refunds");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSidebarOpen, navigate]);

  /* ---------------- Branch Change ---------------- */
  const handleBranchChange = (e) => {
    dispatch(setSelectedBranch(e.target.value));
  };

  return (
    <header
      className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 
      bg-neutral-50 dark:bg-neutral-900 
      border-b border-neutral-200 dark:border-neutral-700"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="truncate">
            <h1
              className="text-base sm:text-xl font-bold 
              text-neutral-900 dark:text-neutral-50 truncate"
            >
              {settings?.businessName}
            </h1>

            <p
              className="hidden sm:block text-xs 
              text-neutral-500 dark:text-neutral-400"
            >
              Point of Sale Dashboard
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">

          <ThemeToggle />

          {/* Branch Selector */}
          {branches?.length > 0 && (
            <select
              value={selectedBranchId || ""}
              onChange={handleBranchChange}
              className="px-2 py-2 text-xs sm:text-sm rounded-lg
              bg-neutral-100 dark:bg-neutral-800
              border border-neutral-200 dark:border-neutral-700
              text-neutral-800 dark:text-neutral-100"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}

          {/* User Info */}
          {user && (
            <div
              className="flex items-center gap-2 sm:gap-3
              px-2 sm:px-3 py-2 rounded-xl
              bg-neutral-100 dark:bg-neutral-800
              border border-neutral-200 dark:border-neutral-700"
            >
              {/* Avatar */}
              <div
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full
                flex items-center justify-center
                font-bold text-sm
                bg-neutral-200 dark:bg-neutral-700
                text-neutral-800 dark:text-neutral-100"
              >
                {fullName.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="leading-tight min-w-0">
                <p className="font-semibold text-xs sm:text-sm truncate">
                  {fullName}
                </p>

                <p className="text-[10px] sm:text-xs capitalize truncate
                  text-neutral-500 dark:text-neutral-400">
                  {role}
                </p>

                {selectedBranch && (
                  <p className="hidden md:block text-[10px]
                    text-neutral-400 dark:text-neutral-500 truncate">
                    {storeName} • {branchName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default POSHeader;