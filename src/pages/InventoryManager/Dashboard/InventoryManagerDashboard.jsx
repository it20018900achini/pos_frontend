import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getBranchById } from "@/Redux Toolkit/features/branch/branchThunks";
import InventoryManagerSidebar from "./InventoryManagerSidebar";
import InventoryManagerTopbar from "./InventoryManagerTopbar";

export default function InventoryManagerDashboard({ children }) {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  
  useEffect(() => {
    // Fetch branch data when component mounts
    if (localStorage.getItem("jwt") && userProfile?.branchId) {
      dispatch(getBranchById({ id: userProfile.user.branchId, jwt: localStorage.getItem("jwt") }));
    }
  }, [dispatch, userProfile]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <InventoryManagerSidebar />
      <div className="flex-1 flex flex-col">
        <InventoryManagerTopbar />
        <main className="flex-1 overflow-y-auto p-8 md:p-10 lg:p-12 bg-background/80 rounded-tl-3xl shadow-xl m-4">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}