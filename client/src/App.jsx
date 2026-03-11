import { LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  jobs,
  savedJobs } from './data/mockData';
import { Navbar } from "./components/Navbar";
import { FilterSidebar } from "./components/FilterSidebar";
import { JobFeed } from "./components/JobFeed";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { AuthModal } from "./components/AuthModal"; // Import the new AuthModal
import { JobDetailModal } from "./components/JobDetailModal";
import { ApplyModal } from "./components/ApplyModal";
import { ProfilePanel } from "./components/ProfilePanel";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, signOut } from "./store/slices/authSlice";

export function App() {

  // get auth state form redux
  const { user, token, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showAuthModal, setShowAuthModal] = useState(false); // Single auth modal state
  const [authModalMode, setAuthModalMode] = useState("signin"); // Track which mode to show: "signin" or "signup"
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  // Auth & User State
  const [appliedJobs, setAppliedJobs] = useState([]);
  // Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [applyModalJob, setApplyModalJob] = useState(null);
  // Portal Mode
  const [portalMode, setPortalMode] = useState("seeker");

  const isSignedIn = !!user;

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  // Prevent the app from showing "Logged Out" UI while checking the token
  if (loading && token) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  const handleSignOut = () => {
    dispatch(signOut())
    setAppliedJobs([]);
  };

  const handleQuickApplyClick = (job) => {
    if (!isSignedIn) {
      setAuthModalMode("signin"); // Show sign in modal
      setShowAuthModal(true);
      return;
    }
    const alreadyApplied = appliedJobs.some(
      (app) => app.jobTitle === job.title && app.company === job.company,
    );
    if (alreadyApplied) return;
    setApplyModalJob(job);
  };

  const handleSignInClick = () => {
    setAuthModalMode("signin");
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode("signup");
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const submitApplication = (job) => {
    const newApplication = {
      id: Math.random().toString(36).substr(2, 9),
      jobTitle: job.title,
      company: job.company,
      dateApplied: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Applied",
    };
    setAppliedJobs((prev) => [newApplication, ...prev]);
    setApplyModalJob(null);
  };

  const handleViewApplicationDetails = (app) => {
    // Find the full job details from our mock jobs array
    const fullJob = jobs.find(
      (j) => j.title === app.jobTitle && j.company === app.company,
    );
    if (fullJob) {
      setSelectedJob(fullJob);
    }
  };

  const handleSavedJobClick = (savedJob) => {
    const fullJob = jobs.find(
      (j) => j.title === savedJob.title && j.company === savedJob.company,
    );
    if (fullJob) {
      setSelectedJob(fullJob);
    }
  };

  const handleTogglePortalMode = () => {
    setPortalMode("seeker");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar
        isSignedIn={isSignedIn}
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick} 
        onProfileClick={() => setShowProfile(true)}
        onSignOut={handleSignOut}
        onMobileMenuClick={() => setMobileDrawerOpen(true)}
        portalMode={portalMode}
        onTogglePortalMode={handleTogglePortalMode}
      />

      {portalMode === "admin" && user?.role === "admin" ? (
        <div className="p-20 text-center text-2xl font-bold">Welcome, Recruitment Admin</div>
      ) : (
        <>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Sidebar (Filters) - 30% on Desktop */}
              <div className="md:col-span-4 lg:col-span-3">
                <FilterSidebar
                  isSignedIn={isSignedIn}
                  savedJobs={savedJobs}
                  mobileOpen={mobileDrawerOpen}
                  onMobileClose={() => setMobileDrawerOpen(false)}
                  onSavedJobClick={handleSavedJobClick}
                />
              </div>

              {/* Main Feed - 70% on Desktop */}
              <div className="md:col-span-8 lg:col-span-9 space-y-8">
                <JobFeed
                  jobs={jobs}
                  appliedJobs={appliedJobs}
                  onJobClick={setSelectedJob}
                  onQuickApply={handleQuickApplyClick}
                />

                {/* Applications Table Section */}
                <div className="pt-8 border-t border-slate-200">
                  {isSignedIn ? (
                    <ApplicationsTable
                      applications={appliedJobs}
                      onViewDetails={handleViewApplicationDetails}
                    />
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LockIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Sign in to track your applications
                      </h3>
                      <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        Keep track of all your job applications, interview
                        statuses, and offers in one place.
                      </p>
                      <button
                        onClick={handleSignInClick}
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        Sign In
                      </button>
                      <p className="mt-4 text-sm text-slate-500">
                        Don't have an account?{" "}
                        <button
                          onClick={handleSignUpClick}
                          className="font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none"
                        >
                          Create one
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Modals & Panels */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={handleAuthModalClose}
            initialMode={authModalMode}
          />

          <JobDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onQuickApply={handleQuickApplyClick}
            isApplied={
              selectedJob
                ? appliedJobs.some(
                    (app) =>
                      app.jobTitle === selectedJob.title &&
                      app.company === selectedJob.company,
                  )
                : false
            }
            applicationStatus={
              selectedJob
                ? appliedJobs.find(
                    (app) =>
                      app.jobTitle === selectedJob.title &&
                      app.company === selectedJob.company,
                  )?.status
                : undefined
            }
          />

          <ApplyModal
            job={applyModalJob}
            onClose={() => setApplyModalJob(null)}
            onSubmit={submitApplication}
          />

          <ProfilePanel
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
          />
        </>
      )}
    </div>
  );
}