import React, { useEffect, useState } from 'react';
import { XIcon, SendIcon } from 'lucide-react';
export function ApplyModal({ job, onClose, onSubmit }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  useEffect(() => {
    if (job) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      setCoverLetter(''); // Reset on open
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [job]);
  if (!job && !isAnimating) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (job) {
      onSubmit(job, coverLetter);
    }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${job ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose} />


      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 overflow-hidden transition-all duration-300 transform ${job ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">

          <XIcon className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Apply for {job?.title}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">at {job?.company}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-slate-700 mb-2">

              Cover Letter (Optional)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Stand out by explaining why you're a great fit for this role.
            </p>
            <textarea
              id="coverLetter"
              rows={8}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-none"
              placeholder="Dear Hiring Manager..." />

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">

              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">

              <SendIcon className="w-4 h-4" />
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>);

}