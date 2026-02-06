import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/hooks/useSidebar";
import { Menu } from "lucide-react";
import { settings } from "@/constant";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ThemeToggle } from "../theme-toggle";

const POSHeader = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { userProfile } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const user = userProfile?.user;
  const fullName = user?.fullName || "User";
  const role = user?.role?.replace(/_/g, " ") || "";
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
    <header className="sticky top-0 z-50 px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* ✅ ALWAYS VISIBLE TOGGLE */}
          {/* <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:ml-0 ml-20 rounded-lg bg-white shadow-sm hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-800" />
          </Button> */}

          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">
              {settings?.businessName}
            </h1>
            <p className="text-xs text-gray-500">
              Point of Sale Dashboard
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white shadow border">
              <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold bg-indigo-100 text-indigo-700">
                {fullName.charAt(0).toUpperCase()}
              </div>

              <div className="hidden sm:block leading-tight">
                <p className="font-semibold text-sm">{fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
                <p className="text-[10px] text-gray-400">
                  {storeName} • {branchName}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default POSHeader;
