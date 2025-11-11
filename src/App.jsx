import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

// Auth and Store Routes
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

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, loading } = useSelector((state) => state.user);
  const { store } = useSelector((state) => state.store);

  // Fetch user profile on mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(getUserProfile(jwt));
  }, [dispatch]);

  // Fetch store if user is store admin/manager
  useEffect(() => {
    if (userProfile?.role === "ROLE_STORE_ADMIN") {
      dispatch(getStoreByAdmin(userProfile.jwt));
    }
  }, [dispatch, userProfile]);

  // Redirect to landing if user not logged in and not on auth pages
  useEffect(() => {
    if (!loading && !userProfile && !location.pathname.startsWith("/auth")) {
      navigate("/", { replace: true });
    }
  }, [loading, userProfile, location.pathname, navigate]);

  // --- Route rendering based on role ---
  if (loading) return null; // Or a loading spinner

  const renderRoutes = () => {
    if (!userProfile || !userProfile.role) {
      // Not logged in
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
