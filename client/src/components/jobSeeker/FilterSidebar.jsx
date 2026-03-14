import React from 'react';
import {
  BookmarkIcon,
  XIcon,
  SlidersHorizontalIcon,
  LockIcon } from
'lucide-react';
export function FilterSidebar({
  isSignedIn,
  savedJobs,
  mobileOpen,
  onMobileClose,
  onSavedJobClick
}) {
  const sidebarContent =
  <div className="h-full flex flex-col bg-slate-50 md:bg-transparent">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <SlidersHorizontalIcon className="w-5 h-5" />
          Filters
        </div>
        <button
        onClick={onMobileClose}
        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">

          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 md:p-0 space-y-8 overflow-y-auto flex-1">
        {/* Job Type Filter */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
            Job Type
          </h3>
          <div className="space-y-3">
            {['Remote', 'Full-time', 'Part-time', 'Contract'].map((type) =>
          <label
            key={type}
            className="flex items-center group cursor-pointer">

                <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
              defaultChecked={type === 'Remote' || type === 'Full-time'} />

                <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {type}
                </span>
              </label>
          )}
          </div>
        </div>

        {/* Salary Range Filter */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
            Salary Range
          </h3>
          <div className="px-2">
            <input
            type="range"
            min="0"
            max="200"
            defaultValue="120"
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />

            <div className="flex items-center justify-between mt-2 text-xs font-medium text-slate-500">
              <span>$0</span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                $120k+
              </span>
              <span>$200k+</span>
            </div>
          </div>
        </div>

        {/* Saved Jobs */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookmarkIcon className="w-4 h-4" />
            Saved Jobs
          </h3>

          {!isSignedIn ?
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
              <LockIcon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">
                Sign in to see your saved jobs
              </p>
            </div> :

        <div className="space-y-3">
              {savedJobs.map((job) =>
          <div
            key={job.id}
            onClick={() => onSavedJobClick(job)}
            className="group p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">

                  <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {job.company}
                  </div>
                </div>
          )}
            </div>
        }
        </div>
      </div>
    </div>;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen &&
      <div
        className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
        onClick={onMobileClose} />

      }

      {/* Sidebar Container */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:w-full md:bg-transparent md:shadow-none md:translate-x-0 md:z-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        <div className="md:sticky md:top-24 h-full">{sidebarContent}</div>
      </div>
    </>);

}