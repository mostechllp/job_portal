// components/JobDetailModal.jsx
import React, { useEffect, useState } from 'react';
import { XIcon, MapPinIcon, ClockIcon, ZapIcon, CheckIcon, BriefcaseIcon, TagIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function JobDetailModal({
  job,
  onClose,
  onQuickApply,
  isApplied,
  applicationStatus
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
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return 'Recently';
    }
  };

  // Format work type for display (with fallback)
  const formatWorkType = (type) => {
    if (!type) return 'Full-time';
    const types = {
      'remote': 'Remote',
      'hybrid': 'Hybrid',
      'on-site': 'On-site',
      'any': 'Any'
    };
    return types[type] || type;
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
        className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${job ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <span className="text-sm text-slate-400">Job Details</span>
        </div>

        {/* Scrollable Content */}
        {job && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {/* Job Header Info */}
            <div className="flex items-start gap-5 mb-6">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-sm ${logoColor}`}
              >
                {initials}
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
                  {applicationStatus && (
                    <div className="mt-1">
                      <StatusBadge status={applicationStatus} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Salary
                </div>
                <div className="font-semibold text-slate-900">{job.salary}</div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Work Type
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                  {workType}
                </span>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Category
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {job.category || 'Not specified'}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Posted
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                  <ClockIcon className="w-4 h-4 text-slate-400" />
                  {postedDate}
                </div>
              </div>
            </div>

            {/* Tags Section */}
            {job.tags && job.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TagIcon className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Required Skills
                  </h3>
                </div>
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
              </div>
            )}

            {/* Action Button */}
            <div className="mb-8">
              {isApplied ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-green-700 bg-green-50 border border-green-200 transition-colors cursor-default"
                >
                  <CheckIcon className="w-5 h-5" />
                  Applied Successfully
                </button>
              ) : (
                <button
                  onClick={() => onQuickApply(job)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <ZapIcon className="w-5 h-5 fill-current" />
                  Quick Apply
                </button>
              )}
            </div>

            <div className="w-full h-px bg-slate-100 mb-8"></div>

            {/* Job Description */}
            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BriefcaseIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Job Description
                  </h3>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {job.description || 'No description provided for this position.'}
                  </p>
                </div>
              </section>

              {/* About Company Section */}
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  About {job.company}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {job.companyDescription || 
                   `${job.company} is seeking a talented ${job.title} to join their team. 
                   This position offers a competitive salary of ${job.salary} and is based in ${job.location}. 
                   The ideal candidate should have experience with ${job.tags?.join(', ') || 'relevant technologies'} 
                   and a passion for delivering high-quality solutions.`}
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}