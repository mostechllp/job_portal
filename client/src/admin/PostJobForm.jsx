import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
export function PostJobForm({ onPostJob }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && category && salary) {
      onPostJob(title, category, salary);
      setTitle("");
      setCategory("");
      setSalary("");
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Quick Post a Job
      </h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-end"
      >
        <div className="flex-1 w-full">
          <label
            htmlFor="title"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Job Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior React Developer"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label
            htmlFor="category"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none appearance-none"
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
        <div className="flex-1 w-full">
          <label
            htmlFor="salary"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Salary Range
          </label>
          <input
            id="salary"
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g. $120k - $150k"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors h-[38px]"
        >
          <PlusIcon className="w-4 h-4" />
          Post Now
        </button>
      </form>
    </div>
  );
}
