import React from "react";
import { KeyRoundIcon, BuildingIcon, SaveIcon } from "lucide-react";
export function SettingsPage() {
  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };
  return (
    <div className="max-w-3xl space-y-8">
      {/* Company Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <BuildingIcon className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Company Profile
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue="CareerHub Inc."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  defaultValue="https://careerhub.example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  defaultValue="contact@careerhub.example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <SaveIcon className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <KeyRoundIcon className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Change Password
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <SaveIcon className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
