import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function AdminRoute({ children }) {
  const { user, loading, token, isInitialized } = useSelector((state) => state.auth);

  // If not initialized yet, show loading
  if (!isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // If we have a token but loading user data
  if (token && loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // If we have a token but no user (failed load), clear token and redirect
  if (token && !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If no token or not admin, redirect to login
  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // All good, render the protected content
  return children;
}