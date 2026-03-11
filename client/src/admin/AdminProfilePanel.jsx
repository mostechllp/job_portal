import React, { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
export function AdminProfilePanel({ isOpen, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  if (!isOpen && !isAnimating) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div
        className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-900 ml-2">
            Admin Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl flex-shrink-0 border-4 border-white shadow-sm">
              AD
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Admin User</h3>
              <p className="text-slate-500">admin@careerhub.com</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mt-2">
                Hiring Manager
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Personal Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin User"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@careerhub.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue="Hiring Manager"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
