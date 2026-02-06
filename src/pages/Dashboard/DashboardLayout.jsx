import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "@/components/Dashboard/Sidebar";
import POSHeader from "@/components/Dashboard/POSHeader";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <POSHeader />
          <main className="flex-1 overflow-y-auto ">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
