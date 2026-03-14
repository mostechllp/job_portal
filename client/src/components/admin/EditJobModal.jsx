// admin/EditJobModal.jsx
import React, { useEffect, useState } from "react";
import { XIcon, SaveIcon } from "lucide-react";

export function EditJobModal({ job, onClose, onSave }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("full-time");
  const [overview, setOverview] = useState("");
  const [responsibilities, setResponsibilities] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (job) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(job.title || "");
      setCompany(job.company || "");
      setCategory(job.category || "");
      setSalary(job.salary || "");
      setLocation(job.location || "");
      setWorkType(job.workType || "full-time");
      
      if (job.description) {
        setOverview(job.description.overview || "");
        setResponsibilities(job.description.responsibilities?.length ? 
          job.description.responsibilities : [""]);
        setRequirements(job.description.requirements?.length ? 
          job.description.requirements : [""]);
        setBenefits(job.description.benefits?.length ? 
          job.description.benefits : [""]);
      }
      
      setTagsInput(job.tags?.join(", ") || "");
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [job]);

  if (!job && !isAnimating) return null;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const filteredResponsibilities = responsibilities.filter(r => r.trim() !== "");
    const filteredRequirements = requirements.filter(r => r.trim() !== "");
    const filteredBenefits = benefits.filter(b => b.trim() !== "");
    
    if (job && title && category && salary && location && overview && 
        filteredResponsibilities.length > 0 && filteredRequirements.length > 0) {
      
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
        workType,
        description: {
          overview,
          responsibilities: filteredResponsibilities,
          requirements: filteredRequirements,
          benefits: filteredBenefits,
        },
        tags,
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${job ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 transform ${job ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
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
          <form id="edit-job-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Work Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  required
                >
                  {workTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Overview */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Overview
              </label>
              <textarea
                rows={3}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-y"
                required
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Responsibilities
              </label>
              {responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleListChange(setResponsibilities, index, e.target.value, responsibilities)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                    required={index === 0}
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(setResponsibilities, responsibilities, index)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(setResponsibilities, responsibilities)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add Responsibility
              </button>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Requirements
              </label>
              {requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleListChange(setRequirements, index, e.target.value, requirements)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                    required={index === 0}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(setRequirements, requirements, index)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(setRequirements, requirements)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add Requirement
              </button>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Benefits (Optional)
              </label>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleListChange(setBenefits, index, e.target.value, benefits)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                  />
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(setBenefits, benefits, index)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(setBenefits, benefits)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add Benefit
              </button>
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
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-job-form"
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <SaveIcon className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}