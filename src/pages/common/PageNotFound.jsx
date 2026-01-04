import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../Redux Toolkit/features/user/userThunks";
import { useNavigate, useLocation } from "react-router-dom";

const PageNotFound = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, loading, error } = useSelector((state) => state.user);

  const params = new URLSearchParams(location.search);
  const callbackUrl = params.get("callbackUrl") || "/";

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      navigate(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, {
        replace: true,
      });
      return;
    }

    if (!userProfile && !error) {
      dispatch(getUserProfile(jwt));
    }

    if (error) {
      localStorage.removeItem("jwt");
      navigate(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, {
        replace: true,
      });
    }
  }, [dispatch, navigate, userProfile, error, callbackUrl]);

  useEffect(() => {
    if (userProfile) {
      navigate(callbackUrl, { replace: true });
    }
  }, [userProfile, navigate, callbackUrl]);

  // ✅ Show spinner while loading or initial check
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      {(loading || (!userProfile && !error)) && (
        <>
          <Loader2 className="animate-spin h-10 w-10 mb-4" />
          <p className="text-gray-500">Checking authentication...</p>
        </>
      )}
      {error && (
        <p className="text-red-500">Invalid token. Redirecting to login...</p>
      )}
    </div>
  );
};

export default PageNotFound;
