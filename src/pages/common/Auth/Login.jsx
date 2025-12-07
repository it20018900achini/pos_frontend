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
import { startShift } from "@/Redux Toolkit/features/shiftReport/shiftReportThunks";
import { useNavigate } from "react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { settings } from "../../../constant";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.auth);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [forgot, setForgot] = useState({
    show: false,
    email: "",
    emailSent: false,
  });

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    const newErrors = {};
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (formData.password && formData.password.length < 4)
      newErrors.password = "At least 4 characters required";

    setErrors(newErrors);
  }, [formData]);

  const isFormValid =
    formData.email && formData.password && !errors.email && !errors.password;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

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

      if (role === "ROLE_BRANCH_CASHIER") {
        dispatch(startShift(user.branchId));
        navigate("/cashier");
      } else if (role === "ROLE_STORE_ADMIN" || role === "ROLE_STORE_MANAGER") {
        navigate("/store");
      } else if (role === "ROLE_BRANCH_MANAGER" || role === "ROLE_BRANCH_ADMIN") {
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
      {/* ---------------------- LEFT IMAGE PANEL ---------------------- */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Left branding text */}
        <div className="relative z-10 p-12 flex flex-col justify-end h-full text-white">
          <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">
            {settings?.businessName}
          </h1>
          <p className="text-lg text-white/80">
            Smart POS — Manage your store effortlessly.
          </p>
        </div>
      </div>

      {/* ---------------------- RIGHT LOGIN PANEL ---------------------- */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8 relative">
        {/* Theme */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div
          className={`w-full max-w-md  rounded-2xl p-8 ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <ChefHat className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>

            <p className="text-muted-foreground text-sm mt-1">
              {forgot.show ? "Reset your password" : "Sign in to continue"}
            </p>
          </div>

          {/* -------- LOGIN FORM -------- */}
          {!forgot.show && !forgot.emailSent && (
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={emailRef}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 py-6 rounded-xl"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-12 py-6 rounded-xl"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setForgot({ ...forgot, show: true })}
                >
                  Forgot password?
                </button>
              </div>
<Button
                disabled={loading || !isFormValid}
                className="w-full py-6 text-lg rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Please wait...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* -------- FORGOT FORM -------- */}
          {forgot.show && !forgot.emailSent && (
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <label className="text-sm font-medium">Enter your email</label>
              <Input
                type="email"
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
                  className="flex-1 py-6 rounded-xl"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1 py-6 rounded-xl">
                  Send Link
                </Button>
              </div>
            </form>
          )}

          {/* -------- EMAIL SENT -------- */}
          {forgot.emailSent && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-muted-foreground">
                Reset instructions were sent to:
                <br />
                <span className="font-medium">{forgot.email}</span>
              </p>

              <Button
                className="w-full py-6 rounded-xl"
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
