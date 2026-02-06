import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../../../context/hooks/useSidebar";
import { Menu } from "lucide-react";
import { settings } from "../../../constant";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const POSHeader = () => {
  const { setSidebarOpen } = useSidebar();
  const { userProfile } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fullName = userProfile?.user?.fullName || "User";
  const role =
    userProfile?.user?.role?.replace(/_/g, " ") || "";
  const branchName = userProfile?.user?.branch?.name || "Unknown Branch";
  const storeName = userProfile?.user?.branch?.store?.brand || "Unknown Store";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F10") {
        e.preventDefault();
        setSidebarOpen(true);
      }
      if (e.key === "F9") {
        e.preventDefault();
        setSidebarOpen(false);
      }

      if (e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        navigate("/cashier/orders");
      }
      if (e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        navigate("/cashier/customers");
      }
      if (e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        navigate("/cashier");
      }
      if (e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        navigate("/cashier/refunds");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSidebarOpen, navigate]);

  return (
    <header className="
      px-6 py-4 shadow-md
      bg-gradient-to-r
      from-indigo-600 to-purple-600
      dark:from-neutral-900 dark:to-neutral-800
      text-white
    ">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setSidebarOpen(true)}
            className="
              p-2 rounded-md
              bg-white/20 hover:bg-white/30
              dark:bg-neutral-700/50 dark:hover:bg-neutral-600/60
            "
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              {settings?.businessName}
            </h1>
            <p className="text-sm opacity-80">
              Point of Sale Dashboard
            </p>
          </div>
        </div>

        {/* RIGHT */}
        {userProfile && (
          <div className="
            flex items-center gap-3 px-3 py-2 rounded-xl
            bg-white/10 backdrop-blur-sm
            border border-white/20
            dark:bg-neutral-800/70 dark:border-neutral-700
            shadow-sm
          ">
            <div className="
              h-10 w-10 rounded-full flex items-center justify-center
              font-bold text-lg
              bg-white text-indigo-600
              dark:bg-indigo-500 dark:text-white
            ">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="leading-tight">
              <p className="font-semibold text-sm">
                {fullName}
              </p>
              <p className="text-xs opacity-90 -mt-0.5 capitalize">
                {role}
              </p>
              <p className="text-[10px] opacity-70">
                {storeName} • {branchName}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default POSHeader;
