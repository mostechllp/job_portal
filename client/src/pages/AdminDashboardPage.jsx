import React from "react";
import { AdminPortal } from "../components/admin/AdminPortal";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function AdminDashboardPage() {
  const { user, loading, isInitialized } = useSelector((state) => state.auth);

  // Show loading while checking authentication
  if (loading || !isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not admin after initialization, redirect
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminPortal onSwitchToSeeker={() => {}} />;
}