import React, { useEffect, useState } from "react";
import { XIcon, LockIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../store/slices/authSlice";

export function AdminLoginModal({ isOpen, onClose, onSignIn }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      // Reset form when opened
      setEmail("");
      setPassword("");
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(adminLogin({ email, password }));
    
    if (adminLogin.fulfilled.match(result)) {
      // Check if user has admin role
      if (result.payload.user?.role === "admin") {
        onSignIn(); // Call the parent's onSignIn
        onClose(); // Close the modal
      } else {
        // Handle case where user is not admin
        alert("You don't have admin privileges");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 overflow-hidden transition-all duration-300 transform ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Access</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Sign in to manage your employer portal
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Work Email
            </label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              placeholder="admin@company.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In as Admin"}
          </button>
        </form>

        {/* Demo credentials hint */}
        <p className="mt-4 text-xs text-center text-slate-400">
          Demo: admin@careerhub.com / admin123
        </p>
      </div>
    </div>
  );
}