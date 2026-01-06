import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

/* ROUTES */
import AuthRoutes from "./routes/AuthRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import BranchManagerRoutes from "./routes/BranchManagerRoutes";
import BranchAccountantRoutes from "./routes/BranchAccountantRoutes";
import CashierRoutes from "./routes/CashierRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

/* PAGES */
import Landing from "./pages/common/Landing/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import PageNotFound from "./pages/common/PageNotFound";

/* THUNKS */
import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";

const App = () => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.user);
  const { store } = useSelector((state) => state.store);

  /* 🔐 Load profile if JWT exists */
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserProfile(jwt));
    }
  }, [dispatch]);

  /* 🏬 Load store for store-level roles */
  useEffect(() => {
    if (userProfile?.role === "STORE_ADMIN") {
      dispatch(getStoreByAdmin(userProfile.jwt));
    }
  }, [dispatch, userProfile]);

  let content;

  /* ================= AUTHENTICATED ================= */
  if (userProfile?.role) {

    /* 🔑 SUPER ADMIN */
    if (userProfile.role === "ADMIN") {
      content = (
        <Routes>
          <Route path="/" element={<Navigate to="/super-admin" replace />} />
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      );
    }

    /* 💳 CASHIER */
    else if (userProfile.role === "BRANCH_CASHIER") {
      content = (
        <Routes>
          <Route path="/" element={<Navigate to="/cashier" replace />} />
          <Route path="/cashier/*" element={<CashierRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      );
    }

    /* 🏬 STORE ADMIN / MANAGER */
    else if (
      userProfile.role === "STORE_ADMIN" ||
      userProfile.role === "STORE_MANAGER"
    ) {
      if (!store) {
        content = (
          <Routes>
            <Route path="/auth/onboarding" element={<Onboarding />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );
      } else {
        content = (
          <Routes>
            <Route path="/" element={<Navigate to="/store" replace />} />
            <Route path="/store/*" element={<StoreRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );
      }
    }

    /* 🧾 BRANCH ACCOUNTANT (STRICT) */
    else if (userProfile.role === "BRANCH_ACCOUNTANT") {
      content = (
        <Routes>
          <Route path="/" element={<Navigate to="/acc" replace />} />
          <Route path="/acc/*" element={<BranchAccountantRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      );
    }

    /* 🏪 BRANCH ADMIN / MANAGER */
    else if (
      userProfile.role === "BRANCH_MANAGER" ||
      userProfile.role === "BRANCH_ADMIN"
    ) {
      content = (
        <Routes>
          <Route path="/" element={<Navigate to="/branch" replace />} />
          <Route path="/branch/*" element={<BranchManagerRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      );
    }

    /* ❓ UNKNOWN ROLE */
    else {
      content = (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      );
    }
  }

  /* ================= NOT AUTHENTICATED ================= */
  else {
    content = (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    );
  }

  return content;
};

export default App;
