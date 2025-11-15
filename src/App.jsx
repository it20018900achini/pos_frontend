import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

// Routes
import AuthRoutes from "./routes/AuthRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import BranchManagerRoutes from "./routes/BranchManagerRoutes";
import CashierRoutes from "./routes/CashierRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

// Pages
import Landing from "./pages/common/Landing/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import PageNotFound from "./pages/common/PageNotFound";

// Thunks
import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";
import SplashScreen from "./pages/common/SplashScreen";

// Components
// import SplashScreen from "./components/common/SplashScreen";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { userProfile, loading: loadingUser } = useSelector((state) => state.user);
  const { store, loading: loadingStore } = useSelector((state) => state.store);

  // Splash screen state
  const [isReloading, setIsReloading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsReloading(false), 600); // Show splash 0.6s
    return () => clearTimeout(timer);
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !userProfile) {
      dispatch(getUserProfile(jwt));
    }
  }, [dispatch, userProfile]);

  // Fetch store if user is store admin/manager
  useEffect(() => {
    if (
      (userProfile?.role === "ROLE_STORE_ADMIN" ||
        userProfile?.role === "ROLE_STORE_MANAGER") &&
      !store
    ) {
      dispatch(getStoreByAdmin(userProfile.jwt));
    }
  }, [dispatch, userProfile, store]);

  // Show splash screen while loading or reloading
  if (isReloading || loadingUser || loadingStore) {
    return <SplashScreen />;
  }

  // Redirect to landing if not logged in
  if (!userProfile && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/" replace />;
  }

  // Render routes based on role
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
