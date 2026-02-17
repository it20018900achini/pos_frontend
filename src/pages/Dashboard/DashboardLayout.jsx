import { Link, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "@/components/Dashboard/Sidebar";
import POSHeader from "@/components/Dashboard/POSHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getAllBranchesByStore,
  getBranchById,
} from "../../Redux Toolkit/features/branch/branchThunks";
import { getStoreByAdmin } from "@/Redux Toolkit/features/store/storeThunks";
import ChatPage from "../Branch Manager/Chat/ChatPage";

export default function DashboardLayout() {
  const dispatch = useDispatch();

  const { userProfile, loading } = useSelector(
    (state) => state.user
  );

  const token = localStorage.getItem("jwt");
  const branchId = userProfile?.user?.branchId;
  const storeId = userProfile?.user?.storeId;

  /* Fetch branch */
  useEffect(() => {
    if (!token || !branchId) return;

    dispatch(
      getBranchById({
        id: branchId,
        jwt: token,
      })
    );
  }, [dispatch, branchId, token]);

  /* Fetch store */
  useEffect(() => {
    if (!token) return;

    dispatch(getStoreByAdmin(token));
  }, [dispatch, token]);

  /* Fetch all branches */
  useEffect(() => {
    if (!token || !storeId) return;

    dispatch(
      getAllBranchesByStore({
        storeId,
        jwt: token,
      })
    );
  }, [dispatch, storeId, token]);

  /* ------------------- UI ------------------- */

  if (!userProfile && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500 text-center">
          Unauthorized Access
          <br />
          <Link
            to="/auth/login"
            className="text-blue-500 hover:underline"
          >
            Go to Login
          </Link>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <div className="flex flex-col flex-1 min-w-0">

          <POSHeader />

          <main className="flex-1 overflow-y-auto relative">
            <Outlet />

            {/* Optional Floating Chat */}
            <div className="fixed bottom-4 right-4 z-50">
              <ChatPage />
            </div>

          </main>
        </div>

      </div>
    </SidebarProvider>
  );
}
