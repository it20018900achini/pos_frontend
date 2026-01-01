"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  ChefHat,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login, forgotPassword } from "@/Redux Toolkit/features/auth/authThunk";
import { getUserProfile } from "@/Redux Toolkit/features/user/userThunks";
import { useNavigate, useLocation } from "react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { settings } from "../../../constant";
import { useStartShiftMutation } from "../../../Redux Toolkit/features/shift/shiftApi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [startShift] = useStartShiftMutation();
  const { loading } = useSelector((state) => state.auth);

  // 🔑 callback url
  const callbackUrl =
    new URLSearchParams(location.search).get("callbackUrl");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const [forgot, setForgot] = useState({
    show: false,
    email: "",
    emailSent: false,
  });

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    const errs = {};
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Enter a valid email";
    if (formData.password && formData.password.length < 4)
      errs.password = "At least 4 characters required";
    setErrors(errs);
  }, [formData]);

  const isFormValid =
    formData.email && formData.password && !errors.email && !errors.password;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return triggerShake();

    try {
      const res = await dispatch(login(formData)).unwrap();

      toast({ title: "Success", description: "Login successful!" });

      const jwt = localStorage.getItem("jwt");
      dispatch(getUserProfile(jwt));

      const user = res.user;
      const role = user.role;

      // ✅ CALLBACK FIRST
      if (callbackUrl) {
        navigate(callbackUrl, { replace: true });
        return;
      }

      // 🔁 ROLE FALLBACK
      if (role === "ROLE_BRANCH_CASHIER") {
        try {
          await startShift({
            branchId: user.branchId,
            openingCash: 0,
          }).unwrap();
        } catch (e) {
          console.log("Shift already active");
        }
        navigate("/cashier");
      } else if (
        role === "ROLE_STORE_ADMIN" ||
        role === "ROLE_STORE_MANAGER"
      ) {
        navigate("/store");
      } else if (
        role === "ROLE_BRANCH_ADMIN" ||
        role === "ROLE_BRANCH_MANAGER"
      ) {
        navigate("/branch");
      } else {
        navigate("/");
      }
    } catch (err) {
      triggerShake();
      toast({
        title: "Login Failed",
        description: err || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  // 🔁 FORGOT PASSWORD
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgot.email || !/\S+@\S+\.\S+/.test(forgot.email))
      return toast({
        title: "Invalid Email",
        description: "Enter a valid email address.",
        variant: "destructive",
      });

    try {
      await dispatch(forgotPassword(forgot.email)).unwrap();
      toast({
        title: "Email Sent",
        description: "Check your inbox for reset instructions.",
      });
      setForgot({ ...forgot, emailSent: true });
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to send reset email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 p-12 flex flex-col justify-end h-full text-white">
          <h1 className="text-4xl font-bold mb-3">
            {settings?.businessName}
          </h1>
          <p className="text-lg text-white/80">
            Smart POS — Manage your store effortlessly.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div
          className={`w-full max-w-md rounded-2xl p-8 ${
            shake ? "animate-shake" : ""
          }`}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {forgot.show ? "Reset your password" : "Sign in to continue"}
            </p>
          </div>

          {!forgot.show && !forgot.emailSent && (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-5 h-5" />
                  <Input
                    ref={emailRef}
                    type="email"
                    className="pl-10 py-6 rounded-xl"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 w-5 h-5" />
                  <Input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-12 py-6 rounded-xl"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary"
                  onClick={() => setForgot({ ...forgot, show: true })}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                disabled={loading}
                className="w-full py-6 rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Please wait...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {forgot.show && !forgot.emailSent && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <Input
                value={forgot.email}
                onChange={(e) =>
                  setForgot({ ...forgot, email: e.target.value })
                }
                placeholder="you@example.com"
                className="py-6 rounded-xl"
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setForgot({ show: false, email: "", emailSent: false })
                  }
                  className="flex-1 py-6"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1 py-6">
                  Send Link
                </Button>
              </div>
            </form>
          )}

          {forgot.emailSent && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-indigo-600" />
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <Button
                className="w-full py-6"
                onClick={() =>
                  setForgot({ show: false, email: "", emailSent: false })
                }
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
