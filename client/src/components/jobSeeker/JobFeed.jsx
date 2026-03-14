import React, { useEffect, useState, useRef } from "react";
import { JobCard } from "./JobCard";
import { FilterIcon, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, fetchAppliedJobs } from "../../store/slices/seekerJobSlice";

export function JobFeed({
  jobs: propJobs, 
  appliedJobs: propAppliedJobs = [],
  onJobClick,
  onQuickApply,
  onFilterClick,
  filters = {},
  showApplied = false,
}) {
  const dispatch = useDispatch();
  const { jobs: reduxJobs, appliedJobs: reduxAppliedJobs, loading, pagination } = useSelector(
    (state) => state.seekerJobs,
  );
  const [page, setPage] = useState(1);
  const prevFiltersRef = useRef();

  // Use Redux jobs if available, otherwise use props
  const jobs = reduxJobs.length > 0 ? reduxJobs : propJobs;
  const appliedJobsList = propAppliedJobs.length > 0 ? propAppliedJobs : reduxAppliedJobs;

  useEffect(() => {
    // Create a stable string representation of filters to compare
    const filtersString = JSON.stringify({ page, ...filters });
    
    // Only fetch if filters have actually changed
    if (prevFiltersRef.current !== filtersString) {
      prevFiltersRef.current = filtersString;
      
      dispatch(fetchJobs({ page, ...filters }));
    }
  }, [dispatch, page, filters]);

  useEffect(() => {
    // Fetch applied jobs if user is logged in
    if (showApplied) {
      dispatch(fetchAppliedJobs());
    }
  }, [dispatch, showApplied]);

  const handleLoadMore = () => {
    if (page < pagination.pages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleJobClick = (job) => {
  const originalJob = jobs.find(j => (j._id || j.id) === (job._id || job.id));
  onJobClick(originalJob || job);
};

  if (loading && jobs.length === 0 && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm text-slate-500">Loading jobs...</p>
      </div>
    );
  }

  const displayedJobs = showApplied ? appliedJobsList : jobs;

  if (!displayedJobs || displayedJobs.length === 0) {
    return (
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
              {showApplied ? "Applied Jobs" : "Recommended Jobs"}
            </h2>
            <button
              onClick={onFilterClick}
              className="md:hidden p-2 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Filter jobs"
            >
              <FilterIcon className="w-5 h-5" />
            </button>
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
            0 results
          </span>
        </div>

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
            {showApplied ? "No applications yet" : "No jobs found"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {showApplied
              ? "Start applying to jobs to see them here."
              : "Try adjusting your search filters or check back later for new opportunities."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            {showApplied ? "Applied Jobs" : "Recommended Jobs"}
          </h2>
          <button
            onClick={onFilterClick}
            className="md:hidden p-2 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Filter jobs"
          >
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
        <span className="text-xs sm:text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
          {displayedJobs.length} {displayedJobs.length === 1 ? "result" : "results"}
        </span>
      </div>

      {/* Job Cards Container */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {displayedJobs.map((job) => {
          const jobId = job._id || job.id;
          
          const isApplied = appliedJobsList.some(
            (app) => 
              (app.jobId && app.jobId === jobId) || 
              (app.jobTitle === job.title && app.company === job.company)
          );
          
          return (
            <JobCard
              key={jobId}
              job={{
                id: jobId,
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                tags: job.tags || [],
                postedDate: job.createdAt 
                  ? new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : job.postedDate || 'Recently',
                isActive: job.isActive,
              }}
              onJobClick={() => handleJobClick(job)}
              onQuickApply={onQuickApply}
              isApplied={isApplied}
            />
          );
        })}
      </div>

      {/* Load More Button */}
      {!showApplied && jobs.length > 0 && page < pagination?.pages && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="w-full sm:w-auto mx-auto mt-2 sm:mt-4 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : (
            "Load More Jobs"
          )}
        </button>
      )}
    </div>
  );
}