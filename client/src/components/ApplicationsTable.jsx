import React from 'react';
import { StatusBadge } from './StatusBadge';
import { BriefcaseIcon } from 'lucide-react';
export function ApplicationsTable({
  applications,
  onViewDetails
}) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <BriefcaseIcon className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-slate-900">
          My Applications
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">

                  Job Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">

                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">

                  Date Applied
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">

                  Status
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {applications.map((app) =>
              <tr
                key={app.id}
                className="hover:bg-slate-50 transition-colors">

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {app.jobTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">{app.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-500">
                      {app.dateApplied}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                    onClick={() => onViewDetails(app)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors">

                      View details
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}