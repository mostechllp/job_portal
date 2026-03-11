import React, { useEffect, useState } from "react";
import { XIcon, MailIcon, ShieldCheckIcon, ArrowLeftIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  loginUser,
  registerUser,
  verifyOTP,
  resendOTP,
} from "../store/slices/authSlice";

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onForgotPassword,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "seeker",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formData = watch(); // Watch all form values

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      setMode(initialMode);
      setStep(1);
      reset(); // Reset form values
      setOtp("");
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialMode, reset]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen && !isAnimating) return null;

  const onSignInSubmit = async (data) => {
    console.log("Login data:", data);
    const result = await dispatch(
      loginUser({
        email: data.email,
        password: data.password,
      }),
    );

    if (loginUser.fulfilled.match(result)) {
      onClose();
    }
  };

  const onRegisterSubmit = async (data) => {
    console.log("Register data:", data);
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      setStep(2);
      setTimer(60);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      verifyOTP({
        email: formData.email,
        otp,
      }),
    );
    if (verifyOTP.fulfilled.match(result)) {
      onClose();
      reset();
      setOtp("");
    }
  };

  const handleResendOTP = () => {
    dispatch(resendOTP(formData.email));
    setTimer(60);
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setStep(1);
    reset();
    setOtp("");
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in");
  };

  // Validation rules
  const validationRules = {
    name: {
      required: "Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
      pattern: {
        value: /^[a-zA-Z\s]*$/,
        message: "Name can only contain letters and spaces",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        message:
          "Password must contain at least one uppercase, one lowercase, one number and one special character",
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 overflow-hidden transition-all duration-300 transform ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Back button for OTP step */}
        {mode === "signup" && step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === "signin"
              ? "Welcome Back"
              : step === 1
                ? "Create Account"
                : "Verify Email"}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === "signin"
              ? "Sign in to continue to CareerHub"
              : step === 1
                ? "Join CareerHub to find your dream job"
                : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        {/* Google Sign In Button */}
        {step === 1 && (
          <>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                {/* Google SVG paths */}
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  or {mode === "signin" ? "sign in" : "sign up"} with email
                </span>
              </div>
            </div>
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {mode === "signin" && step === 1 && (
          <form onSubmit={handleSubmit(onSignInSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                {...register("email", validationRules.email)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                  errors.email ? "border-red-500" : "border-slate-200"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", validationRules.password)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                  errors.password ? "border-red-500" : "border-slate-200"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-2 mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onForgotPassword) {
                      setTimeout(() => onForgotPassword(), 300);
                    }
                  }}
                  className="font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === "signup" && step === 1 && (
          <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", validationRules.name)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                  errors.name ? "border-red-500" : "border-slate-200"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="signup-email"
                {...register("email", validationRules.email)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                  errors.email ? "border-red-500" : "border-slate-200"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="signup-password"
                {...register("password", validationRules.password)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                  errors.password ? "border-red-500" : "border-slate-200"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        )}

        {/* OTP Verification Form */}
        {mode === "signup" && step === 2 && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center">
              <ShieldCheckIcon className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <p className="text-sm text-slate-600 mb-6">
                We've sent a verification code to{" "}
                <span className="font-medium">{formData.email}</span>
              </p>
            </div>

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-slate-700 mb-2 text-center"
              >
                Enter verification code
              </label>
              <input
                type="text"
                id="otp"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full text-center text-2xl tracking-widest p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center">
              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResendOTP}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-500 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}

        {/* Toggle between sign in and sign up */}
        {step === 1 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer bg-transparent border-none"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
