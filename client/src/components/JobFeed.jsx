import React from 'react';
import { JobCard } from './JobCard';
export function JobFeed({
  jobs,
  appliedJobs,
  onJobClick,
  onQuickApply
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Recommended Jobs
        </h2>
        <span className="text-sm font-medium text-slate-500">
          {jobs.length} results
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {jobs.map((job) => {
          const isApplied = appliedJobs.some(
            (app) => app.jobTitle === job.title && app.company === job.company
          );
          return (
            <JobCard
              key={job.id}
              job={job}
              onJobClick={onJobClick}
              onQuickApply={onQuickApply}
              isApplied={isApplied} />);


        })}
      </div>
    </div>);

}