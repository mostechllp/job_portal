import React from 'react';
import { MapPinIcon, ClockIcon, ZapIcon, CheckIcon } from 'lucide-react';
export function JobCard({
  job,
  onJobClick,
  onQuickApply,
  isApplied
}) {
  return (
    <div
      onClick={() => onJobClick(job)}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200 group cursor-pointer">

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${job.logoColor}`}>

            {job.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
              <span className="font-medium text-slate-700">{job.company}</span>
              <span>•</span>
              <div className="flex items-center gap-1 truncate">
                <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                {job.type}
              </span>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>{job.postedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between h-full gap-4">
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
            {job.salary}
          </span>
          {isApplied ?
          <button
            onClick={(e) => e.stopPropagation()}
            disabled
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg border border-green-200 transition-colors whitespace-nowrap cursor-default">

              <CheckIcon className="w-4 h-4" />
              Applied ✓
            </button> :

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickApply(job);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors whitespace-nowrap shadow-sm">

              <ZapIcon className="w-4 h-4 fill-current" />
              Quick Apply
            </button>
          }
        </div>
      </div>
    </div>);

}