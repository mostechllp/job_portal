import React, { useEffect, useState } from "react";
import { XIcon, SaveIcon } from "lucide-react";
export function EditJobModal({ job, onClose, onSave }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  useEffect(() => {
    if (job) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(job.title);
      setCompany(job.company);
      setCategory(job.category);
      setSalary(job.salary);
      setLocation(job.location);
      setDescription(job.description);
      setTagsInput(job.tags.join(", "));
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [job]);
  if (!job && !isAnimating) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (job && title && category && salary && location && description) {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      onSave({
        ...job,
        title,
        company,
        category,
        salary,
        location,
        description,
        tags,
      });
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${job ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 transform ${job ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Edit Job Posting</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form
            id="edit-job-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Job Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="edit-company"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Company
                </label>
                <input
                  id="edit-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="edit-category"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none appearance-none"
                  required
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Data">Data</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="edit-salary"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Salary Range
                </label>
                <input
                  id="edit-salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="edit-location"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Location
                </label>
                <input
                  id="edit-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Job Description
              </label>
              <textarea
                id="edit-description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-y"
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-tags"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Tags (comma separated)
              </label>
              <input
                id="edit-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-job-form"
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <SaveIcon className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
