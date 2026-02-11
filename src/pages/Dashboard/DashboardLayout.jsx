import { Link, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "@/components/Dashboard/Sidebar";
import POSHeader from "@/components/Dashboard/POSHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getBranchById } from "../../Redux Toolkit/features/branch/branchThunks";
import { getStoreByAdmin } from "@/Redux Toolkit/features/store/storeThunks";
import ChatPage from "../Branch Manager/Chat/ChatPage";

export default function DashboardLayout() {
    const dispatch = useDispatch();
     const { userProfile, loading, initialized } = useSelector(
     (state) => state.user
   );

  useEffect(() => {
    // Fetch branch data when component mounts
    if (localStorage.getItem("jwt") && userProfile?.user?.branchId) {
      dispatch(getBranchById({ id: userProfile.user.branchId, jwt: localStorage.getItem("jwt") }));
    }
  }, [dispatch, userProfile]);
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(getStoreByAdmin(localStorage.getItem("jwt")));
    }
  }, []);
  return (
    <SidebarProvider>{userProfile && !loading ? (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <POSHeader />
          <main className="flex-1 overflow-y-auto ">
            <Outlet />
            <ChatPage/>
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
