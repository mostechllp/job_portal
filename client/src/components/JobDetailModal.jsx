import React, { useEffect, useState } from 'react';
import { XIcon, MapPinIcon, ClockIcon, ZapIcon, CheckIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
export function JobDetailModal({
  job,
  onClose,
  onQuickApply,
  isApplied,
  applicationStatus}) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (job) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [job]);
  if (!job && !isAnimating) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${job ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose} />


      {/* Slide-over Panel */}
      <div
        className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${job ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">

            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        {job &&
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {/* Job Header Info */}
            <div className="flex items-start gap-5 mb-6">
              <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-sm ${job.logoColor}`}>

                {job.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-1">
                      {job.title}
                    </h2>
                    <div className="text-lg font-medium text-slate-700 mb-2">
                      {job.company}
                    </div>
                  </div>
                  {applicationStatus &&
                <div className="mt-1">
                      <StatusBadge status={applicationStatus} />
                    </div>
                }
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Salary
                </div>
                <div className="font-semibold text-slate-900">{job.salary}</div>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Job Type
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                  {job.type}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Posted
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                  <ClockIcon className="w-4 h-4 text-slate-400" />
                  {job.postedDate}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-8">
              {isApplied ?
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-green-700 bg-green-50 border border-green-200 transition-colors cursor-default">

                  <CheckIcon className="w-5 h-5" />
                  Applied
                </button> :

            <button
              onClick={() => onQuickApply(job)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">

                  <ZapIcon className="w-5 h-5 fill-current" />
                  Quick Apply
                </button>
            }
            </div>

            <div className="w-full h-px bg-slate-100 mb-8"></div>

            {/* Description */}
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  About this role
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {job.description}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Responsibilities
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, index) =>
                <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600 leading-relaxed">
                        {item}
                      </span>
                    </li>
                )}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((item, index) =>
                <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600 leading-relaxed">
                        {item}
                      </span>
                    </li>
                )}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  About {job.company}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {job.company} is a fast-growing company dedicated to building
                  innovative solutions. We value creativity, collaboration, and
                  a strong commitment to excellence. Join us to make a
                  meaningful impact in a dynamic environment.
                </p>
              </section>
            </div>
          </div>
        }
      </div>
    </div>);

}