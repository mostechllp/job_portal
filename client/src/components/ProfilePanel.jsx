import React, { useEffect, useState } from 'react';
import { XIcon, UploadCloudIcon } from 'lucide-react';

export function ProfilePanel({ isOpen, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  if (!isOpen && !isAnimating) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose} />


      {/* Slide-over Panel */}
      <div
        className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-900 ml-2">
            My Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">

            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl flex-shrink-0 border-4 border-white shadow-sm">
              JD
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">John Doe</h3>
              <p className="text-slate-500">john.doe@email.com</p>
              <button className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                Edit Photo
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="john.doe@email.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue="San Francisco, CA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
              </div>
            </section>

            {/* Change Password */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Change Password
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
              </div>
            </section>

            {/* Professional Summary */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Professional Summary
              </h4>
              <textarea
                rows={4}
                defaultValue="Senior Frontend Engineer with 6+ years of experience building scalable web applications. Passionate about user experience, performance optimization, and clean code."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-none" />

            </section>

            {/* Resume */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Resume
              </h4>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <UploadCloudIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Upload new resume
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  PDF, DOCX up to 10MB
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                  resume_john_doe.pdf
                  <button className="text-indigo-400 hover:text-indigo-600">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                'React',
                'TypeScript',
                'Node.js',
                'GraphQL',
                'Tailwind CSS',
                'Figma'].
                map((skill) =>
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">

                    {skill}
                    <button className="ml-1.5 text-indigo-400 hover:text-indigo-600 focus:outline-none">
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-dashed border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors">
                  + Add Skill
                </button>
              </div>
            </section>

            {/* Experience */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Experience
                </h4>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Add New
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-xl bg-white">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-semibold text-slate-900">
                      Senior Frontend Engineer
                    </h5>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      2021 - Present
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">TechCorp</div>
                  <p className="text-sm text-slate-500">
                    Led the frontend team in migrating the legacy application to
                    React. Improved performance by 40%.
                  </p>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-white">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-semibold text-slate-900">
                      Frontend Developer
                    </h5>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      2018 - 2021
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">
                    WebSolutions Inc.
                  </div>
                  <p className="text-sm text-slate-500">
                    Developed responsive web applications for various clients
                    using React and Vue.js.
                  </p>
                </div>
              </div>
            </section>

            {/* Job Preferences */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Job Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Preferred Role
                  </label>
                  <input
                    type="text"
                    defaultValue="Frontend Engineer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    defaultValue="$140k - $180k"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none" />

                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Work Type
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none appearance-none">
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">

            Save Changes
          </button>
        </div>
      </div>
    </div>);

}