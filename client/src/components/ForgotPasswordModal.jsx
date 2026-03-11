import React, { useState, useEffect } from "react";
import {
  XIcon,
  MailIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  KeyIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../store/slices/authSlice";

export function ForgotPasswordModal({ isOpen, onClose, onBackToSignIn }) {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      // Reset state when modal opens
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen && !isAnimating) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      setStep(2);
      setTimer(60);
      if (result.payload?.dev_otp) {
        console.log("📝 Development OTP:", result.payload.dev_otp);
        setOtp(result.payload.dev_otp);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyResetOTP({ email, otp }));

    if (verifyResetOTP.fulfilled.match(result)) {
      setStep(3);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordError("");

    const result = await dispatch(
      resetPassword({
        email,
        otp,
        newPassword,
      }),
    );

    if (resetPassword.fulfilled.match(result)) {
      // Success - close modal and show success message or go to sign in
      onClose();
      // Optionally switch to sign in modal
      if (onBackToSignIn) {
        setTimeout(() => onBackToSignIn(), 300);
      }
    }
  };

  const handleResendOTP = () => {
    dispatch(forgotPassword(email));
    setTimer(60);
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

        {/* Back button */}
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 1 && <MailIcon className="w-8 h-8 text-indigo-600" />}
            {step === 2 && (
              <ShieldCheckIcon className="w-8 h-8 text-indigo-600" />
            )}
            {step === 3 && <KeyIcon className="w-8 h-8 text-indigo-600" />}
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && "Enter your new password"}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {passwordError}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="reset-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label
                htmlFor="reset-otp"
                className="block text-sm font-medium text-slate-700 mb-2 text-center"
              >
                Enter verification code
              </label>
              <input
                type="text"
                id="reset-otp"
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
              {loading ? "Verifying..." : "Verify OTP"}
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

        {/* Step 3: New Password Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back to Sign In */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <button
            onClick={onBackToSignIn}
            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer bg-transparent border-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
