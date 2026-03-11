// components/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function AdminRoute({ children }) {
  const { user, loading, token } = useSelector((state) => state.auth);

  // Show loading while checking authentication
  if (loading && token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, redirect
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated and admin, render children
  return children;
}