import React, { useEffect, useState } from "react";
import { useSidebar } from "@/context/hooks/useSidebar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ThemeToggle } from "../theme-toggle";
import { switchBranch } from "@/Redux Toolkit/features/auth/authThunk";
import { setSelectedBranch } from "@/Redux Toolkit/features/user/userSlice";
import { Loader2, Store, ChevronDown } from "lucide-react"; // Added for Pro look

const POSHeader = () => {
  const { setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, selectedBranchId, branchLoading } = useSelector((state) => state.user);
  const [switchingBranch, setSwitchingBranch] = useState(false);
  const [showSelect, setShowSelect] = useState(false);

  const user = userProfile?.user;
  const fullName = user?.fullName || "User";
  const selectedBranch = user?.roleBranchMap?.find((b) => b.branchId === selectedBranchId);
  const role = selectedBranch?.roles?.map((r) => r.replace(/_/g, " "))?.join(", ") || "";
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
        const keys = { o: "/cashier/orders", c: "/cashier/customers", d: "/cashier", r: "/cashier/refunds" };
        const path = keys[e.key.toLowerCase()];
        if (path) navigate(path);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSidebarOpen, navigate]);

  /* ---------------- Branch Change ---------------- */
  const handleBranchChange = async (e) => {
    const branchId = Number(e.target.value);
    if (!branchId || branchId === selectedBranchId) return;

    const previousBranch = selectedBranchId;
    setSwitchingBranch(true);
    dispatch(setSelectedBranch(branchId));

    try {
      await dispatch(switchBranch(branchId)).unwrap();
    } catch (err) {
      dispatch(setSelectedBranch(previousBranch));
      alert("Failed to switch branch.");
    } finally {
      setSwitchingBranch(false);
    }
  };

  useEffect(() => {
    if (branchLoading) {
      setShowSelect(false);
    } else {
      const timer = setTimeout(() => setShowSelect(true), 1500); // Reduced to 1.5s for snappier feel
      return () => clearTimeout(timer);
    }
  }, [branchLoading]);

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between gap-3">
        
        {/* LEFT: Theme & Branch Selection */}
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          
          <div className="h-8 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

          {!showSelect || branchLoading ? (
            /* Pro Skeleton Loader - Replaces the buggy <select> */
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse border border-neutral-200 dark:border-neutral-700">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Syncing...</span>
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Store className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <select
                value={selectedBranchId || ""}
                onChange={handleBranchChange}
                disabled={switchingBranch}
                className="pl-9 pr-8 py-2 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 appearance-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer hover:border-indigo-300"
              >
                <option value="" disabled>Select Branch</option>
                {branches.map((b) => (
                  <option key={b.branchId} value={b.branchId}>{b.branchName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              
              {switchingBranch && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 animate-pulse rounded-full" />
              )}
            </div>
          )}
        </div>

        {/* RIGHT: User Profile Card */}
        {user && (
          <div className="flex items-center gap-3 pl-3 py-1 pr-1 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="hidden sm:block text-right">
              <p className="font-black text-[11px] uppercase tracking-wider text-neutral-900 dark:text-neutral-100 leading-none">
                {fullName}
              </p>
              <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1 leading-none">
                {role}
              </p>
            </div>

            <div className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              {fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default POSHeader;