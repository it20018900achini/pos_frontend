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

  // Extract useful data
  const fullName = userProfile?.fullName || "User";
  const role =
    userProfile?.role?.replace("ROLE_", "").replace(/_/g, " ") || "";
  const branchName = userProfile?.branch?.name || "Unknown Branch";
  const storeName = userProfile?.branch?.store?.brand || "Unknown Store";
  const navigate = useNavigate();

  // ✅ Listen for F10 key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F10") {
        e.preventDefault(); // prevent browser default behavior
        setSidebarOpen(true);
      }
      if (e.key === "F9") {
        e.preventDefault(); // prevent browser default behavior
        setSidebarOpen(false);
      }
      
      // Shift + O → Go to orders
      if (e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        navigate("/cashier/orders");
      }
      // Shift + c → Go to orders
      if (e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        navigate("/cashier/customers");
      }
      // Shift + c → Go to orders
      if (e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        navigate("/cashier");
      }

      // Shift + c → Go to orders
      if (e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        navigate("/cashier/refunds");
      }


    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSidebarOpen]);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white shadow-md">
      <div className="flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-white/20 hover:bg-white/30"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              {settings?.businessName}
            </h1>
            <p className="text-sm opacity-80">Point of Sale Dashboard</p>
          </div>
        </div>

        {/* Right Section */}
        {userProfile && (
          <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="leading-tight">
              <p className="font-semibold text-white text-sm">{fullName}</p>
              <p className="text-xs opacity-90 -mt-0.5">{role}</p>
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
