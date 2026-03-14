import { LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { savedJobs } from "../data/mockData";

import { Navbar } from "../components/common/Navbar";
import { FilterSidebar } from "../components/jobSeeker/FilterSidebar";
import { JobFeed } from "../components/jobSeeker/JobFeed";
import { ApplicationsTable } from "../components/jobSeeker/ApplicationsTable";
import { AuthModal } from "../components/common/AuthModal";
import { JobDetailModal } from "../components/jobSeeker/JobDetailModal";
import { ApplyModal } from "../components/jobSeeker/ApplyModal";
import { ProfilePanel } from "../components/jobSeeker/ProfilePanel";
import { ForgotPasswordModal } from "../components/common/ForgotPasswordModal";

import { useDispatch, useSelector } from "react-redux";
import { loadUser, signOut } from "../store/slices/authSlice";

export function HomePage() {
  const { user, token, loading } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.seekerJobs);
  const dispatch = useDispatch();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [appliedJobs, setAppliedJobs] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [applyModalJob, setApplyModalJob] = useState(null);

  const [showForgotPasswordModal, setShowForgotPasswordModal] =
    useState(false);

  const isSignedIn = !!user;

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  if (loading && token) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleSignOut = () => {
    dispatch(signOut());
    setAppliedJobs([]);
  };

  const handleQuickApplyClick = (job) => {
    if (!isSignedIn) {
      setAuthModalMode("signin");
      setShowAuthModal(true);
      return;
    }

    const alreadyApplied = appliedJobs.some(
      (app) => app.jobTitle === job.title && app.company === job.company
    );

    if (alreadyApplied) return;

    setApplyModalJob(job);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar
        isSignedIn={isSignedIn}
        user={user}
        onSignInClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfile(true)}
        onSignOut={handleSignOut}
        onMobileMenuClick={() => setMobileDrawerOpen(true)}
        savedJobsCount={savedJobs.length}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3">
            <FilterSidebar
              isSignedIn={isSignedIn}
              savedJobs={savedJobs}
              mobileOpen={mobileDrawerOpen}
              onMobileClose={() => setMobileDrawerOpen(false)}
            />
          </div>

          <div className="md:col-span-8 lg:col-span-9 space-y-8">
            <JobFeed
              jobs={jobs}
              appliedJobs={appliedJobs}
              onJobClick={setSelectedJob}
              onQuickApply={handleQuickApplyClick}
            />

            <ApplicationsTable applications={appliedJobs} />
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />

      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onQuickApply={handleQuickApplyClick}
      />

      <ApplyModal
        job={applyModalJob}
        onClose={() => setApplyModalJob(null)}
      />

      <ProfilePanel
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}