// components/FullPostJobForm.jsx (add scroll to matches)
import React, { useState, useEffect, useRef } from "react";
import { PlusIcon, Loader2, UsersIcon } from "lucide-react";
import { MatchingCandidates } from "../admin/MatchingCandidates";

export function FullPostJobForm({ onPostJob, initialData = null, isEditing = false }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("CareerHub Inc.");
  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [matches, setMatches] = useState([]);
  const [postedJob, setPostedJob] = useState(null);
  
  const matchesRef = useRef(null);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCompany(initialData.company || "CareerHub Inc.");
      setCategory(initialData.category || "");
      setSalary(initialData.salary || "");
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      setTagsInput(initialData.tags?.join(", ") || "");
    }
  }, [initialData]);

  // Scroll to matches when they appear
  useEffect(() => {
    if (showMatches && matchesRef.current) {
      setTimeout(() => {
        matchesRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showMatches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && category && salary && location && description) {
      setIsSubmitting(true);
      try {
        const tags = tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        
        const result = await onPostJob({
          title,
          company,
          category,
          salary,
          location,
          description,
          tags,
        });

        // If this is a new job posting and we got matches back
        if (!isEditing && result?.matches) {
          setMatches(result.matches);
          setPostedJob(result.job);
          setShowMatches(true);
        }

        // Reset form only if not editing
        if (!isEditing) {
          setTitle("");
          setCategory("");
          setSalary("");
          setLocation("");
          setDescription("");
          setTagsInput("");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const categories = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "Data",
    "Product",
    "Customer Support",
    "Other"
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          {isEditing ? "Edit Job Posting" : "Create a New Job Posting"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... existing form fields ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="full-title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="full-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior React Developer"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="full-company"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Company <span className="text-red-500">*</span>
              </label>
              <input
                id="full-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="full-category"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="full-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none appearance-none"
                required
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Select category...
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="full-salary"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Salary Range <span className="text-red-500">*</span>
              </label>
              <input
                id="full-salary"
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $120k - $150k"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="full-location"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="full-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, or New York, NY"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="full-description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Job Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Include expectations, responsibilities, and eligibility requirements.
            </p>
            <textarea
              id="full-description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-y"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="full-tags"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Tags (comma separated)
            </label>
            <input
              id="full-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. React, TypeScript, Remote"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-8 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEditing ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  {isEditing ? "Update Job Posting" : "Publish Job Posting"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Matching Candidates Section */}
      {showMatches && postedJob && (
        <div ref={matchesRef} className="scroll-mt-20">
          <MatchingCandidates
            matches={matches}
            job={postedJob}
            onClose={() => setShowMatches(false)}
          />
        </div>
      )}
    </div>
  );
}