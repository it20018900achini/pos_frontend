"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/use-toast";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";

import { login } from "@/Redux Toolkit/features/auth/authThunk";
import { getUserProfile } from "@/Redux Toolkit/features/user/userThunks";
import { selectAuthLoading } from "@/Redux Toolkit/features/auth/authSelectors";

import { settings } from "../../../constant";

const redirectByRole = () => "/dashboard?login=true";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const callbackUrl = new URLSearchParams(location.search).get("callbackUrl");
  const loadingAuth = useSelector(selectAuthLoading);

  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- VALIDATION ---------------- */

  useEffect(() => {
    const errs = {};

    if (formState.email && !/\S+@\S+\.\S+/.test(formState.email))
      errs.email = "Invalid email address";

    if (formState.password && formState.password.length < 4)
      errs.password = "Minimum 4 characters";

    setErrors(errs);
  }, [formState]);

  const isValid =
    formState.email &&
    formState.password &&
    !errors.email &&
    !errors.password;

  /* ---------------- LOGIN ---------------- */

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isValid) return;

      try {
        const res = await dispatch(
          login({
            email: formState.email,
            password: formState.password,
          })
        ).unwrap();

        setLoginSuccess(true);

        const profile = await dispatch(getUserProfile()).unwrap();
        const user = profile.user || res.data?.user;

        const branchId =
          user?.roleBranchMap?.[0]?.id || user?.defaultBranch?.id;

        if (branchId) {
          localStorage.setItem("selectedBranchId", branchId);
        }

        toast({
          title: "Welcome back 👋",
          description: "Login successful",
        });

        const role = user?.roles?.[0];

        setTimeout(() => {
          if (callbackUrl) return navigate(callbackUrl, { replace: true });
          navigate(redirectByRole(role));
        }, 900);
      } catch (err) {
        toast({
          title: "Login failed",
          description: err,
          variant: "destructive",
        });
      }
    },
    [formState, callbackUrl, dispatch, navigate]
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-muted/30 to-background">

      {/* LEFT BRAND SECTION */}

      <div className="hidden lg:flex w-1/2 relative overflow-hidden">

        <img
          src="/bg-img.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
              <ShoppingCart size={28} />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              {settings?.businessName}
            </h1>

          </div>

          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Smart POS system designed to manage your stores,
            employees, sales and inventory with ease.
          </p>

        </div>
      </div>

      {/* RIGHT LOGIN AREA */}

      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 relative">

        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        {/* SUCCESS STATE */}

        {loginSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">

            <CheckCircle className="w-14 h-14 text-green-500" />

            <h3 className="text-xl font-semibold">
              Login Successful
            </h3>

            <p className="text-muted-foreground text-sm">
              Redirecting you to your dashboard...
            </p>

            <Loader2 className="animate-spin text-primary" />

          </div>
        ) : (
          /* LOGIN CARD */

          <div className="w-full max-w-md backdrop-blur-xl bg-card/80 border border-border shadow-2xl rounded-2xl p-8">

            {/* HEADER */}

            <div className="text-center mb-8">

              <div className="mx-auto w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <ShoppingCart className="text-primary-foreground" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Sign in to your account
              </p>

            </div>

            {/* LOGIN FORM */}

            <form onSubmit={handleLogin} className="space-y-5">

              {/* EMAIL */}

              <div>
                <div className="relative">

                  <Mail className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />

                  <Input
                    placeholder="Email address"
                    className="pl-10 h-11"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        email: e.target.value,
                      })
                    }
                  />

                </div>

                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div>
                <div className="relative">

                  <Lock className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 h-11"
                    value={formState.password}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        password: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* BUTTON */}

              <Button
                disabled={!isValid || loadingAuth}
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition"
              >
                {loadingAuth ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

            </form>

            {/* FOOTER */}

            <div className="text-center mt-6 text-sm text-muted-foreground">
              Secure login powered by{" "}
              <span className="font-medium text-foreground">
                {settings?.businessName}
              </span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}