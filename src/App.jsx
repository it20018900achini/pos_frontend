import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* ROUTES */
import AuthRoutes from "./routes/AuthRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import BranchManagerRoutes from "./routes/BranchManagerRoutes";
import BranchAccountantRoutes from "./routes/BranchAccountantRoutes";
import CashierRoutes from "./routes/CashierRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import BranchInventoryManagerRoutes from "./routes/BranchInventoryManagerRoutes";

/* PAGES */
import Landing from "./pages/common/Landing/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import PageNotFound from "./pages/common/PageNotFound";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ChatPage from "./pages/Branch Manager/Chat/ChatPage";

/* THUNKS */
import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";
import DashboardRoutes from "./routes/DashboardRoutes";

/* ROLE → PATH mapping */
const ROLE_PATH = {
  ADMIN: "/super-admin",
  BRANCH_MANAGER: "/branch",
  BRANCH_ADMIN: "/branch",
  BRANCH_CASHIER: "/cashier",
  BRANCH_ACCOUNTANT: "/acc",
  BRANCH_INVENTORY_MANAGER: "/inventory",
  STORE_ADMIN: "/store",
  STORE_MANAGER: "/store",
};

const App = () => {
  const dispatch = useDispatch();
  const { userProfile, loading } = useSelector((state) => state.user);
  const { store } = useSelector((state) => state.store);

  /* Load profile */
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(getUserProfile(jwt));
  }, [dispatch]);

  /* Load store if needed */
  useEffect(() => {
    const needsStore = userProfile?.user.roles?.some(
      (r) => ["STORE_ADMIN", "STORE_MANAGER"].includes(r)
    );
    if (needsStore && userProfile?.user.jwt) {
      dispatch(getStoreByAdmin(userProfile.jwt));
    }
  }, [dispatch, userProfile]);

  if (loading) return null; // wait for profile

  const defaultRole =
    Array.isArray(userProfile?.user.roles) && userProfile?.user.user?.roles.length > 0
      ? userProfile.user.roles[0]
      : null;
  const defaultPath = defaultRole ? ROLE_PATH[defaultRole] : "/";

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/auth/onboarding" element={<Onboarding />} />

        {/* DASHBOARD WRAPPER */}
        {/* <Route
          path="/dashboard/*"
          element={
            <DashboardLayout/>
          }
        > */}

                  <Route path="/dashboard/*" element={<DashboardRoutes />} />
                  

          {/* You can put nested routes for dashboard here if needed */}
        {/* </Route> */}

        {/* ROLE-BASED ROUTES */}
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
        <Route path="/branch/*" element={<BranchManagerRoutes />} />
        <Route path="/cashier/*" element={<CashierRoutes />} />
        <Route path="/acc/*" element={<BranchAccountantRoutes />} />
        <Route path="/inventory/*" element={<BranchInventoryManagerRoutes />} />
        <Route path="/store/*" element={<StoreRoutes />} />

        {/* DEFAULT REDIRECT AFTER LOGIN */}
        {defaultPath && (
          <Route path="/redirect" element={<Navigate to={defaultPath} replace />} />
        )}

        {/* CATCH ALL */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
