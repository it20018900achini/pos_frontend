import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useSidebar } from "../../../context/hooks/useSidebar";
import { ChefHat } from "lucide-react";
import { settings } from "../../../constant";

const POSHeader = () => {
  const {setSidebarOpen} = useSidebar();
  return (
    <div className="bg-green-700 border-b px-6 py-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <Button
            className="z-10 p-2 rounded shadow-lg border border-border text-neutral-800 bg-white hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold "> {settings?.businessName}</h1>
          {/* <p className="text-sm text-muted-foreground">
           
            Create new order</p> */}
        </div>
        <div className="flex items-center space-x-2">
          {/* <Badge variant="outline" className="text-xs">
            F1: Search | F2: Discount | F3: Customer | Ctrl+Enter: Payment
          </Badge> */}
        </div>
      </div>
    </div>
  );
};

export default POSHeader;
