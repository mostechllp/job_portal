import React, { useState } from "react";
import { 
  UsersIcon, 
  MailIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon
} from "lucide-react";

export function MatchingCandidates({ matches, job, onClose }) {
  const [expandedId, setExpandedId] = useState(null);
  const [emailStatus, setEmailStatus] = useState({});

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-amber-600 bg-amber-50";
    return "text-slate-600 bg-slate-50";
  };

  const handleSendEmail = (user) => {
    // Simulate sending email
    setEmailStatus(prev => ({ ...prev, [user._id]: 'sending' }));
    setTimeout(() => {
      setEmailStatus(prev => ({ ...prev, [user._id]: 'sent' }));
    }, 1500);
  };

  const handleDownloadList = () => {
    const content = matches.map(m => 
      `${m.user.name},${m.user.email},${m.matchScore}%,${m.matchReasons.join('; ')}`
    ).join('\n');
    
    const blob = new Blob([`Name,Email,Match Score,Match Reasons\n${content}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matches_${job.title.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Matching Candidates Found! 🎯
              </h3>
              <p className="text-indigo-100 text-sm">
                {matches.length} candidates match this job posting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XCircleIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Job Summary */}
      <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">{job.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-indigo-700">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSignIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-indigo-700">{job.salary}</span>
          </div>
        </div>
        {job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">{matches.length}</span> candidates match your requirements
        </p>
        <button
          onClick={handleDownloadList}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <DownloadIcon className="w-4 h-4" />
          Download List
        </button>
      </div>

      {/* Candidates List */}
      <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
        {matches.map((match) => (
          <div key={match.user._id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {match.user.profileImg ? (
                    <img
                      src={match.user.profileImg}
                      alt={match.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-700 font-semibold">
                        {match.user.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900">{match.user.name}</h4>
                    <p className="text-xs text-slate-500">{match.user.email}</p>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(match.matchScore)}`}>
                    {match.matchScore}% Match
                  </span>
                  {match.skills?.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {match.skills.length} skills
                    </span>
                  )}
                </div>

                {/* Skills Preview */}
                {match.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {match.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {match.skills.length > 3 && (
                      <span className="text-xs text-slate-400">
                        +{match.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setExpandedId(expandedId === match.user._id ? null : match.user._id)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                >
                  {expandedId === match.user._id ? (
                    <>Show less <ChevronUpIcon className="w-3 h-3" /></>
                  ) : (
                    <>View match reasons <ChevronDownIcon className="w-3 h-3" /></>
                  )}
                </button>

                {/* Expanded Content */}
                {expandedId === match.user._id && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs font-medium text-indigo-900 mb-2">Why they match:</p>
                    <ul className="space-y-1">
                      {match.matchReasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-indigo-700 flex items-start gap-2">
                          <CheckCircleIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendEmail(match.user)}
                  disabled={emailStatus[match.user._id] === 'sent'}
                  className={`p-2 rounded-lg transition-colors ${
                    emailStatus[match.user._id] === 'sent'
                      ? 'bg-emerald-50 text-emerald-600'
                      : emailStatus[match.user._id] === 'sending'
                      ? 'bg-slate-100 text-slate-400'
                      : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title={emailStatus[match.user._id] === 'sent' ? 'Email sent' : 'Send email'}
                >
                  {emailStatus[match.user._id] === 'sent' ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <MailIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          ✉️ Email notifications have been sent to top matching candidates
        </p>
      </div>
    </div>
  );
}