import React, { useEffect, useState } from "react";
import { useSidebar } from "@/context/hooks/useSidebar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ThemeToggle } from "../theme-toggle";
import { switchBranch } from "@/Redux Toolkit/features/auth/authThunk";
import { setSelectedBranch } from "@/Redux Toolkit/features/user/userSlice";

const SelectBranch = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, selectedBranchId,branchLoading } = useSelector((state) => state.user);
  const [switchingBranch, setSwitchingBranch] = useState(false);

  const user = userProfile?.user;
  const fullName = user?.fullName || "User";

  // Find the currently selected branch
  const selectedBranch = user?.roleBranchMap?.find(
    (b) => b.branchId === selectedBranchId
  );
  const role =
    selectedBranch?.roles?.map((r) => r.replace(/_/g, " "))?.join(", ") || "";

  const branches = user?.roleBranchMap || [];
  const branchName = selectedBranch?.branchName || "Select Branch";
  const storeName = user?.store?.name || "";

  /* ---------------- Keyboard Shortcuts ---------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;

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
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSidebarOpen, navigate]);

  /* ---------------- Branch Change ---------------- */
  const handleBranchChange = async (e) => {
    const branchId = Number(e.target.value);
    if (!branchId) return;

    const previousBranch = selectedBranchId; // save for rollback
    setSwitchingBranch(true);
    dispatch(setSelectedBranch(branchId)); // optimistic update

    try {
      const data = await dispatch(switchBranch(branchId)).unwrap();

      // Optional: update userProfile.user if backend returns updated user info
      // dispatch({ type: "user/setUserProfile", payload: data.user });
    } catch (err) {
      console.error("Branch switch failed:", err);
      dispatch(setSelectedBranch(previousBranch)); // rollback on error
      alert("Failed to switch branch. Please try again.");
    } finally {
      setSwitchingBranch(false);
    }
  };
 const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    if (branchLoading) {
      setShowSelect(false); // hide select while loading
    } else {
      const timer = setTimeout(() => {
        setShowSelect(true); // show select after 3s
      }, 3000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [branchLoading]);

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-end md:justify-between flex-wrap gap-3">
        {/* LEFT: Theme & Branch */}
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          
          {branchLoading || !showSelect  ?<select value="" className="px-2 py-2 text-xs sm:text-sm rounded-lg border text-neutral-800 dark:text-neutral-100"><option>Loading...</option></select> :branches.length > 0 && (
            <div className="relative">
             {showSelect&&<select
                value={selectedBranchId || ""}
                onChange={handleBranchChange}
                disabled={switchingBranch}
                className={`px-2 py-2 text-xs sm:text-sm rounded-lg border text-neutral-800 dark:text-neutral-100
                  ${
                    switchingBranch
                      ? "bg-neutral-200 dark:bg-neutral-700 cursor-not-allowed"
                      : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  }`}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.branchName}
                  </option>
                ))}
              </select>} 
              {switchingBranch && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-500 dark:text-neutral-400">
                  Switching...
                </span>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: User Info */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            {/* Avatar */}
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center font-bold text-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100">
              {fullName.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="leading-tight min-w-0">
              <p className="font-semibold text-xs sm:text-sm truncate">{fullName}</p>
              <p className="text-[10px] sm:text-xs capitalize truncate text-neutral-500 dark:text-neutral-400">
                {role}
              </p>
              {selectedBranch && (
                <p className="hidden md:block text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                  {storeName} • {branchName}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SelectBranch;