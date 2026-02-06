import { Link, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "@/components/Dashboard/Sidebar";
import POSHeader from "@/components/Dashboard/POSHeader";
import { useSelector } from "react-redux";

export default function DashboardLayout() {
    const { userProfile, loading, initialized } = useSelector(
    (state) => state.user
  );
  return (
    <SidebarProvider>{userProfile && !loading ? (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <POSHeader />
          <main className="flex-1 overflow-y-auto ">
            <Outlet />
          </main>
        </div>
      </div>): (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-500">{loading ? "Loading dashboard..." : "Unauthorized Access"}
         <br/>   <Link to="/auth/login" className="text-blue-500 hover:underline ml-2">
              Go to Login
            </Link>
          </p>
        </div>
      ) }       
    </SidebarProvider>
  );
}
