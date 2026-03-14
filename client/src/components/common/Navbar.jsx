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
  Briefcase,
  ListChecksIcon,
  ChevronDownIcon,
  MapPinIcon,
  BuildingIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchSuggestions,
  searchJobs,
} from "../../store/slices/seekerJobSlice";

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

  // search states
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    category: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const dropdownRef = useRef(null);
  const adminMenuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { searchSuggestions, searchLoading } = useSelector(
    (state) => state.seekerJobs,
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
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
    setShowSuggestions(false);
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
      id: "manage-jobs",
      label: "Manage Jobs",
      icon: Briefcase,
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

  useEffect(() => {
    if (!isAdminRoute && searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        dispatch(
          searchJobs({
            query: searchQuery,
            location: searchFilters.location,
            category: searchFilters.category,
            limit: 5,
            forSuggestions: true,
          }),
        );
        setShowSuggestions(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      dispatch(clearSearchSuggestions());
    }
  }, [searchQuery, searchFilters, dispatch, isAdminRoute]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isAdminRoute && searchQuery.trim()) {
      setShowSuggestions(false);
      // Navigate to jobs page with search params
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      if (searchFilters.location)
        params.set("location", searchFilters.location);
      if (searchFilters.category)
        params.set("category", searchFilters.category);

      navigate(`/jobs?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);

    // Scroll to the job
    const event = new CustomEvent("scrollToJob", {
      detail: { jobId: suggestion._id },
    });
    window.dispatchEvent(event);
  };

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchFilters({ location: "", category: "" });
    setShowSuggestions(false);
  };

  const handleAdminNavigation = (itemId) => {
    onAdminTabChange(itemId);
    setAdminMenuOpen(false);
  };

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

          {/* Center: Search with Suggestions - Hidden on mobile */}
          <div
            className="hidden md:block flex-1 max-w-2xl px-4 lg:px-12"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>

                {/* Main Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    searchQuery.length >= 2 && setShowSuggestions(true)
                  }
                  className="block w-full pl-10 pr-24 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Search jobs by title, skills, or company..."
                />

                {/* Filter Toggle Button */}
                {/* <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                    showFilters ||
                    searchFilters.location ||
                    searchFilters.category
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Filters
                </button> */}
              </div>

              {/* Filters Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={searchFilters.location}
                          onChange={(e) =>
                            handleFilterChange("location", e.target.value)
                          }
                          placeholder="City, state, or remote"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={searchFilters.category}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All Categories</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Data">Data</option>
                        <option value="Product">Product</option>
                        <option value="Customer Support">
                          Customer Support
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchFilters({ location: "", category: "" });
                        setShowFilters(false);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Search Suggestions */}
              {showSuggestions &&
                searchSuggestions &&
                searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion._id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <BuildingIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600">
                              {suggestion.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {suggestion.company} • {suggestion.location}
                            </p>
                            {suggestion.highlights && (
                              <p className="text-xs text-indigo-600 mt-1 line-clamp-1">
                                {suggestion.highlights}
                              </p>
                            )}
                          </div>
                          {suggestion.matchScore && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {suggestion.matchScore}% Match
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}

                    {/* View all results link */}
                    <div className="p-2 bg-slate-50 border-t border-slate-200">
                      <button
                        onClick={handleSearch}
                        className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}

              {showSuggestions &&
                searchSuggestions?.length === 0 &&
                searchQuery.length >= 2 &&
                !searchLoading && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4 text-center z-50">
                    <p className="text-sm text-slate-500">
                      No jobs found matching "{searchQuery}"
                    </p>
                  </div>
                )}

              {searchLoading && showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4 text-center z-50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500">Searching...</p>
                  </div>
                </div>
              )}
            </form>
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

            {/* Admin Navigation - Desktop */}
            {isAdminRoute && (
              <div className="hidden md:flex items-center gap-1">
                {/* Overview */}
                <button
                  onClick={() => handleAdminNavigation("overview")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === "overview"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Overview
                </button>

                {/* Post a Job */}
                <button
                  onClick={() => handleAdminNavigation("post-job")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === "post-job"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Post a Job
                </button>
                <button
                  onClick={() => handleAdminNavigation("manage-jobs")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === "manage-jobs"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Manage Jobs
                </button>

                {/* Candidates */}
                <button
                  onClick={() => handleAdminNavigation("candidates")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === "candidates"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Candidates
                </button>

                {/* Settings */}
                <button
                  onClick={() => handleAdminNavigation("settings")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    adminActiveTab === "settings"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Settings
                </button>
              </div>
            )}

            {/* Admin Menu Button - Mobile only */}
            {isAdminRoute && (
              <div className="relative md:hidden" ref={adminMenuRef}>
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

                {/* Admin Dropdown Menu - Mobile */}
                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
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

                      if (item.subItems) {
                        return (
                          <div
                            key={item.id}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              {item.label}
                            </div>
                            {item.subItems.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => {
                                    handleAdminNavigation(subItem.id);
                                    setAdminMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                    adminActiveTab === subItem.id
                                      ? "bg-indigo-50 text-indigo-700 font-medium"
                                      : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <SubIcon
                                    className={`w-4 h-4 ${adminActiveTab === subItem.id ? "text-indigo-600" : "text-slate-500"}`}
                                  />
                                  {subItem.label}
                                </button>
                              );
                            })}
                          </div>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleAdminNavigation(item.id);
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
                {user?.profileImg ? (
                  <img
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    src={user.profileImg}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer"
                    alt={user.name}
                    aria-label="User menu"
                  />
                ) : (
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold text-xs sm:text-sm border-2 border-white shadow-sm"
                    aria-label="User menu"
                  >
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                  </button>
                )}

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
          <div
            className="md:hidden py-3 border-t border-slate-200 animate-slideDown"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                  placeholder="Search jobs..."
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <XIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              {/* Mobile Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    placeholder="Location"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={searchFilters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Category</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Data">Data</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Search Jobs
              </button>

              {/* Mobile Search Suggestions */}
              {showSuggestions &&
                searchSuggestions &&
                searchSuggestions.length > 0 && (
                  <div className="mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    {searchSuggestions.slice(0, 3).map((suggestion) => (
                      <button
                        key={suggestion._id}
                        onClick={() => {
                          handleSuggestionClick(suggestion);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {suggestion.company}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
