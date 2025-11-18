import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import AuthRoutes from "./routes/AuthRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import BranchManagerRoutes from "./routes/BranchManagerRoutes";
import CashierRoutes from "./routes/CashierRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

import Landing from "./pages/common/Landing/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import PageNotFound from "./pages/common/PageNotFound";

import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";
import SplashScreen from "./pages/common/SplashScreen";


const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { userProfile, loading: loadingUser } = useSelector((state) => state.user);
  const { store, loading: loadingStore } = useSelector((state) => state.store);

  // State for initial splash loading
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show splash for at least 600ms
    const timer = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !userProfile) dispatch(getUserProfile(jwt));
  }, [dispatch, userProfile]);

  // Fetch store for store admin/manager
  useEffect(() => {
    if (
      (userProfile?.role === "ROLE_STORE_ADMIN" ||
        userProfile?.role === "ROLE_STORE_MANAGER") &&
      !store
    ) {
      dispatch(getStoreByAdmin(userProfile.jwt));
    }
  }, [dispatch, userProfile, store]);

  // Show splash while initial loading OR data is fetching
  if (initialLoading || loadingUser || loadingStore) {
    return <SplashScreen />;
  }

  // Redirect if not logged in
  if (!userProfile && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/" replace />;
  }

  // Role-based routes
  const renderRoutes = () => {
    if (!userProfile || !userProfile.role) {
      return (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      );
    }

    switch (userProfile.role) {
      case "ROLE_ADMIN":
        return (
          <Routes>
            <Route path="/" element={<Navigate to="/super-admin" replace />} />
            <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );

      case "ROLE_BRANCH_CASHIER":
        return (
          <Routes>
            <Route path="/" element={<Navigate to="/cashier" replace />} />
            <Route path="/cashier/*" element={<CashierRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );

      case "ROLE_STORE_ADMIN":
      case "ROLE_STORE_MANAGER":
        if (!store) {
          return (
            <Routes>
              <Route path="/auth/onboarding" element={<Onboarding />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          );
        }
        return (
          <Routes>
            <Route path="/" element={<Navigate to="/store" replace />} />
            <Route path="/store/*" element={<StoreRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );

      case "ROLE_BRANCH_MANAGER":
      case "ROLE_BRANCH_ADMIN":
        return (
          <Routes>
            <Route path="/" element={<Navigate to="/branch" replace />} />
            <Route path="/branch/*" element={<BranchManagerRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );

      default:
        return (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );
    }
  };

  return renderRoutes();
};

export default App;
