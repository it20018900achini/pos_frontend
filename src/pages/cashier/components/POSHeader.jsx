import React from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../../../context/hooks/useSidebar";
import { Search, Users, CreditCard, Menu } from "lucide-react";
import { settings } from "../../../constant";

const POSHeader = () => {
  const { setSidebarOpen } = useSidebar();

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
        <div className="flex items-center gap-3">
          <Button className="bg-white/20 hover:bg-white/30 text-white">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>

          <Button className="bg-white/20 hover:bg-white/30 text-white">
            <Users className="h-4 w-4 mr-2" /> Customer
          </Button>

          <Button className="bg-white text-indigo-600 hover:bg-gray-100">
            <CreditCard className="h-4 w-4 mr-2" /> Payment
          </Button>
        </div>

      </div>
    </header>
  );
};

export default POSHeader;
