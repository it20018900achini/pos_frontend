import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import AuthRoutes from "./routes/AuthRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import BranchManagerRoutes from "./routes/BranchManagerRoutes";
import CashierRoutes from "./routes/CashierRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

import Landing from "./pages/common/Landing/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import PageNotFound from "./pages/common/PageNotFound";
import SplashScreen from "./pages/common/SplashScreen";

import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";


// ----------------------- JWT Expiration Helper -----------------------
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch (e) {
    console.log(e)
    return true;
  }
};
// ---------------------------------------------------------------------

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, loading: loadingUser } = useSelector((state) => state.user);
  const { store, loading: loadingStore } = useSelector((state) => state.store);

  const [initialLoading, setInitialLoading] = useState(true);

  // Splash screen delay
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Check token validity before anything else
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt || isTokenExpired(jwt)) {
      localStorage.removeItem("jwt");
      navigate("/auth/login", { replace: true });
    }
  }, [navigate]);

  // Load user profile
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !userProfile) {
      dispatch(getUserProfile(jwt));
    }
  }, [dispatch, userProfile]);

  // Fetch store for store admin/manager
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (
      jwt &&
      userProfile?.role &&
      (userProfile.role === "ROLE_STORE_ADMIN" ||
        userProfile.role === "ROLE_STORE_MANAGER") &&
      store === undefined
    ) {
      dispatch(getStoreByAdmin(jwt));
    }
  }, [dispatch, userProfile, store]);

  // Show splash
  if (initialLoading || loadingUser || loadingStore) {
    return <SplashScreen />;
  }

  // If profile failed but user is on protected routes → redirect login
  if (!userProfile && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Routes>
      {/* ---------------- Public Pages ---------------- */}
      {!userProfile && (
        <>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </>
      )}

      {/* ---------------- Super Admin ---------------- */}
      {userProfile?.role === "ROLE_ADMIN" && (
        <>
          <Route path="/" element={<Navigate to="/super-admin" replace />} />
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </>
      )}

      {/* ---------------- Cashier ---------------- */}
      {userProfile?.role === "ROLE_BRANCH_CASHIER" && (
        <>
          <Route path="/" element={<Navigate to="/cashier" replace />} />
          <Route path="/cashier/*" element={<CashierRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </>
      )}

      {/* ---------------- Store Admin / Manager ---------------- */}
      {(userProfile?.role === "ROLE_STORE_ADMIN" ||
        userProfile?.role === "ROLE_STORE_MANAGER") && (
        <>
          {store === null ? (
            <>
              <Route path="/auth/onboarding" element={<Onboarding />} />
              <Route path="*" element={<Navigate to="/auth/onboarding" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/store" replace />} />
              <Route path="/store/*" element={<StoreRoutes />} />
              <Route path="*" element={<PageNotFound />} />
            </>
          )}
        </>
      )}

      {/* ---------------- Branch Manager/Admin ---------------- */}
      {(userProfile?.role === "ROLE_BRANCH_MANAGER" ||
        userProfile?.role === "ROLE_BRANCH_ADMIN") && (
        <>
          <Route path="/" element={<Navigate to="/branch" replace />} />
          <Route path="/branch/*" element={<BranchManagerRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </>
      )}

      {/* ---------------- Fallback ---------------- */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
