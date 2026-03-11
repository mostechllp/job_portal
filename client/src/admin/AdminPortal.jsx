// admin/AdminPortal.jsx
import React, { useMemo, useState } from "react";
import {
  PlusCircleIcon,
} from "lucide-react";
import { StatsCards } from "./StatsCards";
import { PostJobForm } from "./PostJobForm";
import { FullPostJobForm } from "./FullPostJobForm";
import { ApplicantTable } from "./ApplicantTable";
import { JobManager } from "./JobManager";
import { EditJobModal } from "./EditJobModal";
import { SettingsPage } from "./SettingsPage";
import { AdminProfilePanel } from "./AdminProfilePanel";
import { initialAdminJobs, initialApplicants } from "../data/adminMockData";
import { Navbar } from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export function AdminPortal({ onSwitchToSeeker }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [adminJobs, setAdminJobs] = useState(initialAdminJobs);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [editingJob, setEditingJob] = useState(null);
  const [showAdminProfile, setShowAdminProfile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Computed stats
  const stats = useMemo(() => {
    return {
      activeJobs: adminJobs.filter((j) => j.isActive).length,
      totalApplicants: applicants.length,
      newToday: applicants.filter((a) => a.appliedDate === "Today").length,
      hired: applicants.filter((a) => a.status === "Hired").length,
    };
  }, [adminJobs, applicants]);

  // Handlers
  const handlePostJobQuick = (title, category, salary) => {
    const newJob = {
      id: `j${Date.now()}`,
      title,
      company: "CareerHub Inc.",
      category,
      salary,
      location: "Remote",
      postedDate: "Just now",
      applicantCount: 0,
      isActive: true,
      description: "Description not provided.",
      tags: [],
    };
    setAdminJobs([newJob, ...adminJobs]);
    alert(`Successfully posted: ${title}`);
  };

  const handlePostJobFull = (jobData) => {
    const newJob = {
      ...jobData,
      id: `j${Date.now()}`,
      postedDate: "Just now",
      applicantCount: 0,
      isActive: true,
    };
    setAdminJobs([newJob, ...adminJobs]);
    setActiveTab("overview");
    alert(`Successfully posted: ${jobData.title}`);
  };

  const handleEditJobSave = (updatedJob) => {
    setAdminJobs((jobs) =>
      jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)),
    );
    setEditingJob(null);
  };

  const handleToggleJob = (jobId) => {
    setAdminJobs((jobs) =>
      jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              isActive: !j.isActive,
            }
          : j,
      ),
    );
  };

  const handleDeleteJob = (jobId) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setAdminJobs((jobs) => jobs.filter((j) => j.id !== jobId));
    }
  };

  const handleStatusChange = (applicantId, newStatus) => {
    setApplicants((apps) =>
      apps.map((a) =>
        a.id === applicantId
          ? {
              ...a,
              status: newStatus,
            }
          : a,
      ),
    );
  };

  const handleDownloadResume = (applicant) => {
    const content = `Resume for ${applicant.name}\nEmail: ${applicant.email}\nApplied for: ${applicant.jobAppliedFor}\nMatch Score: ${applicant.matchScore}%`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${applicant.name.toLowerCase().replace(" ", "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/");
  };

  const handleExitAdmin = () => {
    onSwitchToSeeker();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        isSignedIn={true}
        user={user}
        onSignInClick={() => navigate("/admin/login")}
        onSignUpClick={() => navigate("/admin/login")}
        onProfileClick={() => setShowAdminProfile(true)}
        onSignOut={handleSignOut}
        onMobileMenuClick={() => {}}
        isAdminRoute={true}
        adminActiveTab={activeTab}
        onAdminTabChange={setActiveTab}
        onExitAdmin={handleExitAdmin}
      />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 capitalize">
              {activeTab === "post-job" ? "Post a New Job" : activeTab}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Manage your job postings and candidates.
            </p>
          </div>

          {/* Content based on active tab */}
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              <StatsCards stats={stats} />
              
              {/* Quick Post Job Form - Desktop only */}
              <div className="hidden lg:block">
                <PostJobForm onPostJob={handlePostJobQuick} />
              </div>
              
              {/* Mobile Post Job Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setActiveTab("post-job")}
                  className="w-full bg-indigo-600 text-white p-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Post a New Job
                </button>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-2">
                  <ApplicantTable
                    applicants={applicants.slice(0, 5)}
                    onStatusChange={handleStatusChange}
                    onDownloadResume={handleDownloadResume}
                  />
                  
                  {/* View All Link */}
                  {applicants.length > 5 && (
                    <button
                      onClick={() => setActiveTab("candidates")}
                      className="mt-4 w-full text-center text-sm font-medium text-indigo-600 bg-indigo-50 py-3 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      View All Candidates ({applicants.length})
                    </button>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                        Active Jobs
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {adminJobs
                        .filter((j) => j.isActive)
                        .slice(0, 4)
                        .map((job) => (
                          <div
                            key={job.id}
                            className="p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                          >
                            <div>
                              <div className="font-medium text-sm sm:text-base text-slate-900">
                                {job.title}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {job.applicantCount} applicants
                              </div>
                            </div>
                            <button
                              onClick={() => handleToggleJob(job.id)}
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 self-end sm:self-auto px-3 py-1.5 sm:px-0 sm:py-0"
                            >
                              {job.isActive ? "Close" : "Reopen"}
                            </button>
                          </div>
                        ))}
                    </div>
                    
                    {/* Manage Jobs Link */}
                    <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
                      <button
                        onClick={() => setActiveTab("post-job")}
                        className="w-full text-center text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Manage All Jobs →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "post-job" && (
            <div className="space-y-6 sm:space-y-8">
              <FullPostJobForm onPostJob={handlePostJobFull} />
              <div className="mt-6 sm:mt-8">
                <JobManager
                  jobs={adminJobs}
                  onToggleJob={handleToggleJob}
                  onDeleteJob={handleDeleteJob}
                  onEditJob={setEditingJob}
                />
              </div>
            </div>
          )}

          {activeTab === "candidates" && (
            <ApplicantTable
              applicants={applicants}
              onStatusChange={handleStatusChange}
              onDownloadResume={handleDownloadResume}
            />
          )}

          {activeTab === "settings" && <SettingsPage />}
        </div>
      </main>

      <EditJobModal
        job={editingJob}
        onClose={() => setEditingJob(null)}
        onSave={handleEditJobSave}
      />

      <AdminProfilePanel
        isOpen={showAdminProfile}
        onClose={() => setShowAdminProfile(false)}
      />
    </div>
  );
}