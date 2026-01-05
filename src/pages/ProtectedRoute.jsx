"use client";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const jwt = localStorage.getItem("jwt");

  // If user is not authenticated or JWT is missing, redirect to login
  if (!isAuthenticated || !jwt) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected component
  return <>{children}</>;
}
