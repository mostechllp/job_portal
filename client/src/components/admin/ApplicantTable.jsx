import React, { useState, Fragment } from "react";
import { DownloadIcon, FileTextIcon } from "lucide-react";
export function ApplicantTable({
  applicants,
  onStatusChange,
  onDownloadResume,
}) {
  const [expandedApplicantId, setExpandedApplicantId] = useState(null);
  const toggleExpand = (id) => {
    setExpandedApplicantId((prev) => (prev === id ? null : id));
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shortlist":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Interview":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Reject":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };
  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 75) return "text-amber-600";
    return "text-slate-600";
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Recent Applicants
        </h3>
        <span className="text-sm font-medium text-slate-500">
          {applicants.length} total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Candidate
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Applied For
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Match Score
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Resume
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {applicants.map((applicant) => (
              <Fragment key={applicant.id}>
                <tr
                  className={`hover:bg-slate-50 transition-colors ${expandedApplicantId === applicant.id ? "bg-slate-50" : ""}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${applicant.avatarColor}`}
                      >
                        {applicant.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {applicant.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {applicant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {applicant.jobAppliedFor}
                    </div>
                    <div className="text-xs text-slate-500">
                      {applicant.appliedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${applicant.matchScore >= 90 ? "bg-emerald-500" : applicant.matchScore >= 75 ? "bg-amber-500" : "bg-slate-400"}`}
                          style={{
                            width: `${applicant.matchScore}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-bold ${getScoreColor(applicant.matchScore)}`}
                      >
                        {applicant.matchScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={applicant.status}
                      onChange={(e) =>
                        onStatusChange(applicant.id, e.target.value)
                      }
                      className={`text-xs font-medium rounded-full px-2.5 py-1 border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-6 bg-no-repeat bg-[right_0.5rem_center] bg-[length:10px_10px] ${getStatusColor(applicant.status)}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      }}
                    >
                      <option value="New">New</option>
                      <option value="Shortlist">Shortlist</option>
                      <option value="Interview">Interview</option>
                      <option value="Hired">Hired</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleExpand(applicant.id)}
                        className={`p-2 rounded-lg transition-colors inline-flex items-center justify-center ${expandedApplicantId === applicant.id ? "bg-indigo-100 text-indigo-700" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"}`}
                        title="View Cover Letter"
                      >
                        <FileTextIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDownloadResume(applicant)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Download Resume"
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedApplicantId === applicant.id && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 bg-slate-50 border-t border-slate-100"
                    >
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <FileTextIcon className="w-4 h-4 text-slate-400" />
                          Cover Letter
                        </h4>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                          {applicant.coverLetter || "No cover letter provided."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
