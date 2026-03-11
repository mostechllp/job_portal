// components/JobFeed.jsx
import React from 'react';
import { JobCard } from './JobCard';
import { FilterIcon } from 'lucide-react';

export function JobFeed({
  jobs,
  appliedJobs,
  onJobClick,
  onQuickApply,
  onFilterClick, // Add optional filter click handler
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Header with improved mobile layout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Recommended Jobs
          </h2>
          {/* Mobile filter button - visible only on mobile */}
          <button
            onClick={onFilterClick}
            className="md:hidden p-2 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Filter jobs"
          >
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
        <span className="text-xs sm:text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
          {jobs.length} {jobs.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Job Cards Container */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            const isApplied = appliedJobs.some(
              (app) => app.jobTitle === job.title && app.company === job.company
            );
            return (
              <JobCard
                key={job.id}
                job={job}
                onJobClick={onJobClick}
                onQuickApply={onQuickApply}
                isApplied={isApplied}
              />
            );
          })
        ) : (
          // Empty state
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
              No jobs found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search filters or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>

      {/* Load More Button - if you have pagination */}
      {jobs.length > 0 && jobs.length >= 10 && (
        <button className="w-full sm:w-auto mx-auto mt-2 sm:mt-4 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
          Load More Jobs
        </button>
      )}
    </div>
  );
}