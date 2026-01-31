import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getUserProfile } from "../../Redux Toolkit/features/user/userThunks";

const AuthGuard = ({ allowedRoles = [], children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, loading, error } = useSelector((state) => state.user);
  const callbackUrl = location.pathname + location.search;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, { replace: true });
      return;
    }

    if (!userProfile && !error) {
      dispatch(getUserProfile(jwt));
    }

    if (error) {
      localStorage.removeItem("jwt");
      navigate(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, { replace: true });
    }
  }, [dispatch, navigate, userProfile, error, callbackUrl]);

  // While loading or fetching profile
  if (loading || (!userProfile && !error)) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center">
        <Loader2 className="animate-spin h-10 w-10 mb-4" />
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // Check if user has the required role
  if (allowedRoles.length && !allowedRoles.some((role) => userProfile.roles.includes(role))) {
    navigate("/unauthorized", { replace: true });
    return null;
  }

  return children;
};

export default AuthGuard;
