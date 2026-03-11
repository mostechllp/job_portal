import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
export function FullPostJobForm({ onPostJob }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("CareerHub Inc.");
  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && category && salary && location && description) {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      onPostJob({
        title,
        company,
        category,
        salary,
        location,
        description,
        tags,
      });
      // Reset form
      setTitle("");
      setCategory("");
      setSalary("");
      setLocation("");
      setDescription("");
      setTagsInput("");
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Create a New Job Posting
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="full-title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Job Title
            </label>
            <input
              id="full-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior React Developer"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="full-company"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Company
            </label>
            <input
              id="full-company"
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
              htmlFor="full-category"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Category
            </label>
            <select
              id="full-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none appearance-none"
              required
            >
              <option value="" disabled>
                Select category...
              </option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Data">Data</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="full-salary"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Salary Range
            </label>
            <input
              id="full-salary"
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. $120k - $150k"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="full-location"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Location
            </label>
            <input
              id="full-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote, or New York, NY"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="full-description"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Job Description
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Include expectations, responsibilities, and eligibility
            requirements.
          </p>
          <textarea
            id="full-description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-y"
            required
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
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Publish Job Posting
          </button>
        </div>
      </form>
    </div>
  );
}
