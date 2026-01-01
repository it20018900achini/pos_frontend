// src/components/AuthLoader.jsx
import { Loader2 } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const AuthLoader = () => {
  const { loading, userProfile } = useSelector((state) => state.user);

  // Show spinner while loading user profile
  if (!loading || userProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/40">
      <Loader2 className="animate-spin h-12 w-12 text-white mb-4" />
      <p className="text-white text-lg">Loading user profile...</p>
    </div>
  );
};

export default AuthLoader;
