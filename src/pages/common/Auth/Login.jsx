"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  Loader2,
  ShoppingCart,
} from "lucide-react";

import { login, forgotPassword } from "@/Redux Toolkit/features/auth/authThunk";
import { getUserProfile } from "@/Redux Toolkit/features/user/userThunks";
import { selectAuthLoading } from "@/Redux Toolkit/features/auth/authSelectors";

import { settings } from "../../../constant";

/* ---------------- ROLES ---------------- */
const UserRoles = {
  BRANCH_CASHIER: "BRANCH_CASHIER",
  STORE_ADMIN: "STORE_ADMIN",
  STORE_MANAGER: "STORE_MANAGER",
  BRANCH_MANAGER: "BRANCH_MANAGER",
  BRANCH_ACCOUNTANT: "BRANCH_ACCOUNTANT",
  BRANCH_INVENTORY_MANAGER: "BRANCH_INVENTORY_MANAGER",
};

/* ---------------- REDIRECT BY ROLE ---------------- */
const redirectByRole = (role) => "/dashboard?loading=true";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const callbackUrl = new URLSearchParams(location.search).get("callbackUrl");

  const { userProfile, loading, initialized } = useSelector((state) => state.user);
  const loadingAuth = useSelector(selectAuthLoading);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const [formState, setFormState] = useState({
    mode: "login", // login | forgot | emailSent
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- AUTO REDIRECT IF LOGGED IN ---------------- */
  useEffect(() => {
    if (initialized && !loading && userProfile?.user?.roles?.length > 0) {
      const role = userProfile.user.roles[0];
      navigate(redirectByRole(role), { replace: true });
    }
  }, [initialized, loading, userProfile, navigate]);

  /* ---------------- VALIDATION ---------------- */
  useEffect(() => {
    const errs = {};
    if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) errs.email = "Invalid email";
    if (formState.password && formState.password.length < 4) errs.password = "Minimum 4 characters";
    setErrors(errs);
  }, [formState.email, formState.password]);

  const isLoginValid = formState.email && formState.password && !errors.email && !errors.password;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  /* ---------------- LOGIN ---------------- */
/* ---------------- LOGIN ---------------- */
const handleLogin = useCallback(
  async (e) => {
    e.preventDefault();
    if (!isLoginValid) return triggerShake();

    try {
      // 1️⃣ Login
      const res = await dispatch(
        login({ email: formState.email, password: formState.password })
      ).unwrap();

      toast({ title: "Login successful", description: res.data?.message || "Welcome back!" });

      // 2️⃣ Get profile
      const profile = await dispatch(getUserProfile()).unwrap();

      // 3️⃣ Determine selectedBranchId
      const user = profile.user || res.data?.user;
      const branchId =
        user?.roleBranchMap?.[0]?.id || user?.defaultBranch?.id;

      if (branchId) {
        // 4️⃣ Save to localStorage
        localStorage.setItem("selectedBranchId", branchId);
      }

      const role = user?.roles?.[0];

      // 5️⃣ Redirect
      if (callbackUrl) return navigate(callbackUrl, { replace: true });
      navigate(redirectByRole(role));
    } catch (err) {
      triggerShake();
      toast({
        title: "Login failed",
        description: err?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  },
  [formState, callbackUrl, dispatch, navigate]
);

  /* ---------------- FORGOT PASSWORD ---------------- */
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      return toast({ title: "Invalid email", variant: "destructive" });
    }

    try {
      await dispatch(forgotPassword(formState.email)).unwrap();
      toast({ title: "Email sent", description: "Check your inbox" });
      setFormState((p) => ({ ...p, mode: "emailSent" }));
    } catch (err) {
      toast({ title: "Error", description: err?.message, variant: "destructive" });
    }
  };

  const resetForm = () => setFormState({ mode: "login", email: "", password: "" });

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url(/bg-img.jpg)" }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 p-12 text-white">
          <h1 className="text-4xl font-bold">{settings?.businessName}</h1>
          <p className="opacity-80">Smart POS — Manage your store effortlessly</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className={`w-full max-w-md p-8 rounded-2xl ${shake ? "animate-shake" : ""}`}>
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3">
              <ShoppingCart className="text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
          </div>

          {/* LOGIN FORM */}
          {formState.mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Mail className="absolute mt-4 ml-3" />
                <Input
                  ref={emailRef}
                  placeholder="Email"
                  className="pl-10 py-6"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div>
                <Lock className="absolute mt-4 ml-3" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-12 py-6"
                  value={formState.password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                />
                <button type="button" className="absolute mt-3 right-4" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <Button disabled={!isLoginValid || loadingAuth} className="w-full py-6">
                {loadingAuth ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {formState.mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                placeholder="Email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              />
              <Button className="w-full">Send reset link</Button>
            </form>
          )}

          {/* EMAIL SENT */}
          {formState.mode === "emailSent" && (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto text-green-500" />
              <Button onClick={resetForm} className="w-full">Back to Login</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}