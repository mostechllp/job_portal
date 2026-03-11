import React from "react";
import { Trash2Icon, UsersIcon, PencilIcon } from "lucide-react";
export function JobManager({ jobs, onToggleJob, onDeleteJob, onEditJob }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Manage Active Posts
        </h3>
      </div>
      <div className="divide-y divide-slate-200">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-base font-semibold text-slate-900">
                  {job.title}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${job.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                >
                  {job.isActive ? "Active" : "Closed"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>{job.category}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.salary}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <UsersIcon className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{job.applicantCount}</span>{" "}
                applicants
              </div>

              <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={job.isActive}
                      onChange={() => onToggleJob(job.id)}
                    />

                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${job.isActive ? "bg-indigo-600" : "bg-slate-300"}`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${job.isActive ? "transform translate-x-4" : ""}`}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-slate-700 w-12">
                    {job.isActive ? "Open" : "Close"}
                  </span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditJob(job)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Job"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Job"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No jobs posted yet. Use the form above to create one.
          </div>
        )}
      </div>
    </div>
  );
}
