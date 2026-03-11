// components/JobCard.jsx
import React from 'react';
import { MapPinIcon, ClockIcon, ZapIcon, CheckIcon, BookmarkIcon } from 'lucide-react';

export function JobCard({
  job,
  onJobClick,
  onQuickApply,
  isApplied
}) {
  return (
    <div
      onClick={() => onJobClick(job)}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5 hover:shadow-md transition-shadow duration-200 group cursor-pointer active:bg-slate-50"
    >
      {/* Mobile: Stacked layout, Desktop: Row layout */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Left section with logo and main info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Company Logo/Initials */}
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 ${job.logoColor}`}
          >
            {job.initials}
          </div>

          {/* Job Title & Company - Always visible */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs sm:text-sm text-slate-500">
              <span className="font-medium text-slate-700 truncate">{job.company}</span>
              <span className="flex-shrink-0">•</span>
              <div className="flex items-center gap-1 min-w-0">
                <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Mobile: Full width below, Desktop: Side column */}
        <div className="flex flex-col sm:items-end gap-2 sm:gap-3 pl-13 sm:pl-0">
          {/* Salary - Mobile: Inline with tags, Desktop: Top right */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
            <span className="text-sm sm:text-base font-semibold text-slate-900 sm:whitespace-nowrap">
              {job.salary}
            </span>
            
            {/* Mobile Save Icon - Only visible on mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle save job
              }}
              className="sm:hidden p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label="Save job"
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Job Type & Posted Date */}
          <div className="flex items-center gap-2 sm:justify-end w-full">
            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 whitespace-nowrap">
              {job.type}
            </span>
            <div className="flex items-center gap-1 text-slate-400 text-xs whitespace-nowrap">
              <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{job.postedDate}</span>
            </div>
          </div>

          {/* Action Button - Full width on mobile */}
          {isApplied ? (
            <button
              onClick={(e) => e.stopPropagation()}
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-50 rounded-lg border border-green-200 transition-colors cursor-default mt-1 sm:mt-2"
            >
              <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Applied ✓</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickApply(job);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm mt-1 sm:mt-2"
            >
              <ZapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>Quick Apply</span>
            </button>
          )}
        </div>
      </div>

      {/* Tags/Categories - Optional section if your job has tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-100 overflow-x-auto pb-1 hide-scrollbar">
          {job.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs whitespace-nowrap bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}