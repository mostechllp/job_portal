import React, { useEffect, useState, useRef } from 'react';
import { SearchIcon, MenuIcon, LogOutIcon, UserIcon } from 'lucide-react';
export function Navbar({
  isSignedIn,
  onSignInClick,
  onProfileClick,
  onSignOut,
  onMobileMenuClick,
  portalMode,
  onTogglePortalMode
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target))
      {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuClick}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden transition-colors">

              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">
                  C
                </span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
                Career<span className="text-indigo-600">Hub</span>
              </span>
            </div>
          </div>

          {/* Center: Search & Toggle */}
          <div className="flex-1 max-w-2xl px-4 sm:px-8 lg:px-12 flex items-center gap-4">
            <div className="relative group flex-1 hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Search job title, company, or location..." />

            </div>

            {/* Portal Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => portalMode !== 'seeker' && onTogglePortalMode()}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${portalMode === 'seeker' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>

                Find Jobs
              </button>
              <button
                onClick={() => portalMode !== 'admin' && onTogglePortalMode()}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${portalMode === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>

                Employer
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isSignedIn &&
            <a
              href="#"
              className="hidden md:block text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">

                My Applications
              </a>
            }

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-2"></div>

            {!isSignedIn ?
            <button
              onClick={onSignInClick}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">

                <LogOutIcon className="w-4 h-4" />
                Sign In
              </button> :

            <div className="relative" ref={dropdownRef}>
                <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold text-sm border-2 border-white shadow-sm">

                  JD
                </button>

                {dropdownOpen &&
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <button
                  onClick={() => {
                    onProfileClick();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">

                      View Profile
                    </button>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button
                  onClick={() => {
                    onSignOut();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">

                      Sign Out
                    </button>
                  </div>
              }
              </div>
            }
          </div>
        </div>
      </div>
    </nav>);

}