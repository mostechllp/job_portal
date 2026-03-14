// components/jobSeeker/JobDetailModal.jsx
import React, { useEffect, useState } from 'react';
import { 
  XIcon, MapPinIcon, ClockIcon, ZapIcon, CheckIcon, 
  BriefcaseIcon, TagIcon, DollarSignIcon, BuildingIcon,
  CheckCircleIcon, StarIcon, GiftIcon 
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function JobDetailModal({
  job,
  onClose,
  onQuickApply,
  isApplied,
}) {
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

  // Generate initials from company name
  const getInitials = (companyName) => {
    if (!companyName) return 'CO';
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on company name
  const getCompanyColor = (companyName) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-red-500',
    ];
    
    if (!companyName) return colors[0];
    
    const hash = companyName.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

// Format posted date safely
const formatPostedDate = (dateString) => {
  if (!dateString) return 'Recently';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    
    const now = new Date();
    const diffTime = now - date; // Difference in milliseconds
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  } catch {
    return 'Recently';
  }
};

  // Format work type for display
  const formatWorkType = (type) => {
    const types = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'temporary': 'Temporary',
      'freelance': 'Freelance'
    };
    return types[type] || 'Full-time';
  };

  if (!job && !isAnimating) return null;

  const initials = getInitials(job?.company);
  const logoColor = getCompanyColor(job?.company);
  const workType = formatWorkType(job?.workType);
  const postedDate = formatPostedDate(job?.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${job ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose} 
      />

      {/* Slide-over Panel */}
      <div
        className={`relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${job ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Job Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        {job && (
          <div className="flex-1 overflow-y-auto p-6">
            {/* Company Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-sm ${logoColor}`}>
                {initials}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
                <p className="text-lg text-slate-700 mb-2">{job.company}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BriefcaseIcon className="w-4 h-4" />
                    <span>{workType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>Posted {postedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="text-xs text-slate-500 mb-1">Salary</div>
                <div className="font-semibold text-slate-900">{job.salary}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Category</div>
                <div className="font-semibold text-slate-900">{job.category}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Applicants</div>
                <div className="font-semibold text-slate-900">{job.applicantCount || 0}</div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mb-8">
              {isApplied ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-green-700 bg-green-50 border border-green-200 cursor-default"
                >
                  <CheckIcon className="w-5 h-5" />
                  Applied Successfully
                </button>
              ) : (
                <button
                  onClick={() => onQuickApply(job)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <ZapIcon className="w-5 h-5 fill-current" />
                  Quick Apply
                </button>
              )}
            </div>

            {/* Overview */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-indigo-600" />
                Overview
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {job.description?.overview || 'No overview provided.'}
              </p>
            </section>

            {/* Responsibilities */}
            {job.description?.responsibilities?.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                  Responsibilities
                </h3>
                <ul className="space-y-3">
                  {job.description.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Requirements */}
            {job.description?.requirements?.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-indigo-600" />
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {job.description.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Benefits */}
            {job.description?.benefits?.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <GiftIcon className="w-5 h-5 text-indigo-600" />
                  Benefits
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {job.description.benefits.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <CheckIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TagIcon className="w-5 h-5 text-indigo-600" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}