// admin/FullPostJobForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { PlusIcon, Loader2, XIcon, UsersIcon } from "lucide-react";
import { MatchingCandidates } from "../admin/MatchingCandidates";

export function FullPostJobForm({ onPostJob, initialData = null, isEditing = false }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("CareerHub Inc.");
  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("full-time");
  
  // Description object fields
  const [overview, setOverview] = useState("");
  const [responsibilities, setResponsibilities] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Matching candidates state
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
      setWorkType(initialData.workType || "full-time");
      
      // Handle description object
      if (initialData.description) {
        setOverview(initialData.description.overview || "");
        setResponsibilities(initialData.description.responsibilities?.length ? 
          initialData.description.responsibilities : [""]);
        setRequirements(initialData.description.requirements?.length ? 
          initialData.description.requirements : [""]);
        setBenefits(initialData.description.benefits?.length ? 
          initialData.description.benefits : [""]);
      }
      
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

  // Handle dynamic list fields
  const handleListChange = (setter, index, value, list) => {
    const newList = [...list];
    newList[index] = value;
    setter(newList);
  };

  const addListItem = (setter, list) => {
    setter([...list, ""]);
  };

  const removeListItem = (setter, list, index) => {
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index);
      setter(newList);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty items
    const filteredResponsibilities = responsibilities.filter(r => r.trim() !== "");
    const filteredRequirements = requirements.filter(r => r.trim() !== "");
    const filteredBenefits = benefits.filter(b => b.trim() !== "");
    
    if (title && category && salary && location && overview && 
        filteredResponsibilities.length > 0 && filteredRequirements.length > 0) {
      
      setIsSubmitting(true);
      try {
        const tags = tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        
        const jobData = {
          title,
          company,
          category,
          salary,
          location,
          workType,
          description: {
            overview,
            responsibilities: filteredResponsibilities,
            requirements: filteredRequirements,
            benefits: filteredBenefits,
          },
          tags,
        };
        
        const result = await onPostJob(jobData);

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
          setWorkType("full-time");
          setOverview("");
          setResponsibilities([""]);
          setRequirements([""]);
          setBenefits([""]);
          setTagsInput("");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const categories = [
    "Engineering", "Design", "Marketing", "Sales", 
    "Data", "Product", "Customer Support", "Other"
  ];

  const workTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
    { value: "freelance", label: "Freelance" },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          {isEditing ? "Edit Job Posting" : "Create a New Job Posting"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Salary Range <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. ₹120k - ₹150k"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote, New York, NY"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Work Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                  disabled={isSubmitting}
                >
                  {workTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Overview */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
              Job Overview
            </h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Overview <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Brief description of the role and what it entails.
              </p>
              <textarea
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Write a brief overview of the role..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-y"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Responsibilities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-slate-900">Responsibilities</h4>
              <button
                type="button"
                onClick={() => addListItem(setResponsibilities, responsibilities)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add Responsibility
              </button>
            </div>
            {responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleListChange(setResponsibilities, index, e.target.value, responsibilities)}
                  placeholder={`Responsibility ${index + 1}`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required={index === 0}
                  disabled={isSubmitting}
                />
                {responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(setResponsibilities, responsibilities, index)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-slate-900">Requirements</h4>
              <button
                type="button"
                onClick={() => addListItem(setRequirements, requirements)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add Requirement
              </button>
            </div>
            {requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleListChange(setRequirements, index, e.target.value, requirements)}
                  placeholder={`Requirement ${index + 1}`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required={index === 0}
                  disabled={isSubmitting}
                />
                {requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(setRequirements, requirements, index)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-slate-900">Benefits (Optional)</h4>
              <button
                type="button"
                onClick={() => addListItem(setBenefits, benefits)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add Benefit
              </button>
            </div>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleListChange(setBenefits, index, e.target.value, benefits)}
                  placeholder={`Benefit ${index + 1}`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  disabled={isSubmitting}
                />
                {benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(setBenefits, benefits, index)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. React, TypeScript, Remote"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
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