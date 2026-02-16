import React, { useEffect } from "react";
import { useSidebar } from "@/context/hooks/useSidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { settings } from "@/constant";
import { ThemeToggle } from "../theme-toggle";

const POSHeader = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { userProfile } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const user = userProfile?.user;
  const fullName = user?.fullName || "User";
  const role = user?.roles?.map((r) => r.replace(/_/g, " "))?.join(", ") || "";
  const branchName = user?.branch?.name || "Unknown Branch";
  const storeName = user?.branch?.store?.brand || "Unknown Store";

  /* Keyboard shortcuts */
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

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 py-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 transition-colors">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              {settings?.businessName}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Point of Sale Dashboard
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow border border-neutral-200 dark:border-neutral-700 transition-colors">
              <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100">
                {fullName.charAt(0).toUpperCase()}
              </div>

              <div className="hidden sm:block leading-tight">
                <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-50">{fullName}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{role}</p>
                {
                  (user?.branch?.name)&&(
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                      {storeName} • {branchName}
                    </p>
                  )
                }

              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default POSHeader;
