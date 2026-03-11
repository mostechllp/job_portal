// components/Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  SearchIcon,
  MenuIcon,
  LogOutIcon,
  UserIcon,
  ShieldIcon,
  BookmarkIcon,
  XIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar({
  isSignedIn,
  onSignInClick,
  onProfileClick,
  onSignOut,
  user,
  savedJobsCount = 0,
  isAdminRoute = false,
  adminActiveTab,
  onAdminTabChange,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const adminMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile search on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileSearchOpen(false);
  }, [location]);

  const adminNavItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboardIcon,
    },
    {
      id: "post-job",
      label: "Post a Job",
      icon: PlusCircleIcon,
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: UsersIcon,
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => navigate(isAdminRoute ? "/admin/dashboard" : "/")}
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl leading-none">
                  C
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Career<span className="text-indigo-600">Hub</span>
              </span>
            </div>
          </div>

          {/* Center: Search - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block flex-1 max-w-2xl px-4 lg:px-12">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder={
                  isAdminRoute
                    ? "Search candidates, jobs..."
                    : "Search jobs, companies..."
                }
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {/* Admin Menu Button - Only visible in admin route */}
            {isAdminRoute && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <ShieldIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden xs:inline">
                    Admin
                  </span>
                  <MenuIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>

                {/* Admin Dropdown Menu */}
                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">
                        Admin Menu
                      </p>
                      <p className="text-xs text-slate-500">
                        Manage your portal
                      </p>
                    </div>

                    {adminNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = adminActiveTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onAdminTabChange(item.id);
                            setAdminMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-500"}`}
                          />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Saved Jobs Icon - Only show on main site when signed in */}
            {!isAdminRoute && isSignedIn && (
              <button
                onClick={() => navigate("/saved-jobs")}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Saved Jobs"
              >
                <BookmarkIcon className="w-5 h-5" />
                {savedJobsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {savedJobsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {!isSignedIn ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={onSignInClick}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold text-xs sm:text-sm border-2 border-white shadow-sm"
                  aria-label="User menu"
                >
                  {user?.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onProfileClick();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      View Profile
                    </button>

                    {/* Saved Jobs in dropdown for mobile */}
                    {!isAdminRoute && (
                      <button
                        onClick={() => {
                          navigate("/saved-jobs");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 sm:hidden"
                      >
                        <BookmarkIcon className="w-4 h-4" />
                        Saved Jobs ({savedJobsCount})
                      </button>
                    )}

                    {/* Admin option in user menu (when on main site) */}
                    {user?.role === "admin" && !isAdminRoute && (
                      <button
                        onClick={() => {
                          navigate("/admin/dashboard");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-2"
                      >
                        <ShieldIcon className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="h-px bg-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        onSignOut();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 animate-slideDown">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                placeholder={
                  isAdminRoute
                    ? "Search candidates, jobs..."
                    : "Search jobs, companies..."
                }
                autoFocus
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
