// admin/AdminPortal.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  PlusCircleIcon,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  XCircle,
} from "lucide-react";
import { StatsCards } from "./StatsCards";
import { FullPostJobForm } from "./FullPostJobForm";
import { ApplicantTable } from "./ApplicantTable";
import { JobManager } from "./JobManager";
import { EditJobModal } from "./EditJobModal";
import { SettingsPage } from "./SettingsPage";
import { AdminProfilePanel } from "./AdminProfilePanel";
import { initialApplicants } from "../data/adminMockData";
import { Navbar } from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../store/slices/authSlice";
import { 
  fetchJobs, 
  createJob, 
  updateJob, 
  deleteJob, 
  toggleJobStatus,
  clearJobError 
} from "../store/slices/jobSlice";
import { useNavigate } from "react-router-dom";

export function AdminPortal({ onSwitchToSeeker }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [applicants, setApplicants] = useState(initialApplicants);
  const [editingJob, setEditingJob] = useState(null);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [notification, setNotification] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Show error notification if there's an error
  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/immutability
      showNotification(error, "error");
      dispatch(clearJobError());
    }
  }, [error, dispatch]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Computed stats - mix of real jobs and mock applicants
  const stats = useMemo(() => {
    return {
      activeJobs: jobs?.filter((j) => j.isActive).length || 0,
      totalApplicants: applicants.length,
      newToday: applicants.filter((a) => a.appliedDate === "Today").length,
      hired: applicants.filter((a) => a.status === "Hired").length,
    };
  }, [jobs, applicants]);

  // Filter jobs based on active tab
  const getFilteredJobs = () => {
    if (!jobs) return [];
    
    switch (activeTab) {
      case "active-jobs":
        return jobs.filter(job => job.isActive);
      case "closed-jobs":
        return jobs.filter(job => !job.isActive);
      case "all-jobs":
      case "manage-jobs":
        return jobs;
      default:
        return jobs;
    }
  };


  const handlePostJobFull = async (jobData) => {
    try {
      if (editingJob) {
        await dispatch(updateJob({ id: editingJob._id, jobData })).unwrap();
        showNotification("Job updated successfully!");
        setEditingJob(null);
      } else {
        await dispatch(createJob(jobData)).unwrap();
        showNotification(`Successfully posted: ${jobData.title}`);
      }
      setActiveTab("all-jobs");
    } catch (error) {
      showNotification(error || "Failed to save job", "error");
    }
  };

  const handleEditJobSave = async (updatedJob) => {
    try {
      await dispatch(updateJob({ id: updatedJob._id, jobData: updatedJob })).unwrap();
      setEditingJob(null);
      showNotification("Job updated successfully!");
    } catch (error) {
      showNotification("Failed to update job", error);
    }
  };

  const handleToggleJob = async (jobId) => {
    try {
      await dispatch(toggleJobStatus(jobId)).unwrap();
      showNotification("Job status updated successfully!");
    } catch (error) {
      showNotification("Failed to update job status", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
        showNotification("Job deleted successfully!");
      } catch (error) {
        showNotification("Failed to delete job", error);
      }
    }
  };

  // Applicant Handlers
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

  // Render different content based on active tab
  const renderContent = () => {
    // Job management tabs
    if (["all-jobs", "active-jobs", "closed-jobs", "manage-jobs"].includes(activeTab)) {
      const filteredJobs = getFilteredJobs();
      const tabTitle = activeTab === "all-jobs" ? "All Jobs" :
                      activeTab === "active-jobs" ? "Active Jobs" :
                      activeTab === "closed-jobs" ? "Closed Jobs" : "Manage Jobs";

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">{tabTitle}</h2>
            <button
              onClick={() => setActiveTab("post-job")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Post New Job
            </button>
          </div>
          <JobManager
            jobs={filteredJobs}
            onToggleJob={handleToggleJob}
            onDeleteJob={handleDeleteJob}
            onEditJob={(job) => {
              setEditingJob(job);
              setActiveTab("post-job");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isLoading={loading}
          />
        </div>
      );
    }

    // Post Job tab
    if (activeTab === "post-job") {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingJob ? "Edit Job" : "Post a New Job"}
          </h2>
          <FullPostJobForm 
            onPostJob={handlePostJobFull} 
            initialData={editingJob}
            isEditing={!!editingJob}
          />
        </div>
      );
    }

    // Overview tab
    if (activeTab === "overview") {
      return (
        <div className="space-y-6 sm:space-y-8">
          <StatsCards stats={stats} loading={loading} />
          
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
                <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Active Jobs
                  </h3>
                  <button
                    onClick={() => setActiveTab("all-jobs")}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-slate-200">
                  {loading ? (
                    <div className="p-8 text-center text-slate-500">
                      Loading jobs...
                    </div>
                  ) : jobs?.filter((j) => j.isActive).length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      No active jobs
                    </div>
                  ) : (
                    jobs
                      ?.filter((j) => j.isActive)
                      .slice(0, 4)
                      .map((job) => (
                        <div
                          key={job._id}
                          className="p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                        >
                          <div>
                            <div className="font-medium text-sm sm:text-base text-slate-900">
                              {job.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {job.applicantCount || 0} applicants
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleJob(job._id)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 self-end sm:self-auto px-3 py-1.5 sm:px-0 sm:py-0"
                          >
                            Close
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Candidates tab
    if (activeTab === "candidates") {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Candidates</h2>
          <ApplicantTable
            applicants={applicants}
            onStatusChange={handleStatusChange}
            onDownloadResume={handleDownloadResume}
          />
        </div>
      );
    }

    // Settings tab
    if (activeTab === "settings") {
      return <SettingsPage />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

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
              {activeTab === "post-job" ? (editingJob ? "Edit Job" : "Post a New Job") : 
               activeTab === "all-jobs" ? "All Jobs" :
               activeTab === "active-jobs" ? "Active Jobs" :
               activeTab === "closed-jobs" ? "Closed Jobs" :
               activeTab === "manage-jobs" ? "Manage Jobs" :
               activeTab === "candidates" ? "Candidates" :
               activeTab === "settings" ? "Settings" :
               "Dashboard Overview"}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              {activeTab === "candidates" ? "Review and manage candidate applications" :
               activeTab.includes("jobs") ? "View and manage job postings" :
               activeTab === "post-job" ? (editingJob ? "Edit your job posting" : "Create a new job posting") :
               activeTab === "settings" ? "Configure your portal settings" :
               "Welcome back! Here's what's happening with your job postings."}
            </p>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
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