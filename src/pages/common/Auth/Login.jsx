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
  const containerRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [forgot, setForgot] = useState({
    show: false,
    email: "",
    emailSent: false,
  });

  // ✅ Autofocus email on load
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // ✅ Validate form live
  useEffect(() => {
    const newErrors = {};
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.password && formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    setErrors(newErrors);
  }, [formData]);

  const isFormValid =
    formData.email && formData.password && !errors.email && !errors.password;

  // ✅ Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      triggerShake();
      return;
    }

    try {
      const res = await dispatch(login(formData)).unwrap();

      toast({
        title: "Success",
        description: "Login successful!",
      });

      const jwt = localStorage.getItem("jwt");
      dispatch(getUserProfile(jwt));

      // Navigate based on user role
      const user = res.user;
      const role = user.role;

      if (role === "ROLE_BRANCH_CASHIER") {
        dispatch(startShift(user.branchId));
        navigate("/cashier");
      } else if (
        role === "ROLE_STORE_ADMIN" ||
        role === "ROLE_STORE_MANAGER"
      ) {
        navigate("/store");
      } else if (
        role === "ROLE_BRANCH_MANAGER" ||
        role === "ROLE_BRANCH_ADMIN"
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

  // ✅ Forgot password handler (debounced)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgot.email || !/\S+@\S+\.\S+/.test(forgot.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(forgotPassword(forgot.email)).unwrap();
      toast({
        title: "Email Sent",
        description: "Check your inbox for reset instructions.",
      });
      setForgot((prev) => ({ ...prev, emailSent: true }));
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to send reset email",
        variant: "destructive",
      });
    }
  };

  // ✅ Shake animation for errors
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div
        ref={containerRef}
        className={`w-full max-w-md transition-all duration-300 ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">{settings?.businessName}</span>
          </div>
          <p className="text-muted-foreground">
            {forgot.show ? "Reset your password" : "Sign in to continue"}
          </p>
        </div>

        {/* ✅ Login Form */}
        {!forgot.show && !forgot.emailSent && (
          <form
            onSubmit={handleLogin}
            className="bg-card rounded-2xl shadow-xl p-8 space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={emailRef}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && passwordRef.current?.focus()
                  }
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={passwordRef}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, password: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                  className="pl-10 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setForgot((p) => ({ ...p, show: true }))}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-3 text-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}

        {/* ✅ Forgot Password Form */}
        {forgot.show && !forgot.emailSent && (
          <form
            onSubmit={handleForgotPassword}
            className="bg-card rounded-2xl shadow-xl p-8 space-y-6"
          >
            <label className="block text-sm mb-2">Enter your email</label>
            <Input
              type="email"
              value={forgot.email}
              onChange={(e) =>
                setForgot((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="email@example.com"
            />

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setForgot({ show: false, email: "", emailSent: false })}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Send Reset Link
              </Button>
            </div>
          </form>
        )}

        {/* ✅ Email Sent Success Screen */}
        {forgot.emailSent && (
          <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <h3 className="text-lg font-semibold">Check Your Email</h3>
            <p className="text-muted-foreground mb-4">
              We've sent reset instructions to {forgot.email}
            </p>

            <Button
              className="w-full"
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
  );
};

export default Login;
