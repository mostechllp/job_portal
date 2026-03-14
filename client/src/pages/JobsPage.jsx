import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchJobs } from '../store/slices/seekerJobSlice';
import { JobCard } from '../components/jobSeeker/JobCard';
import { FilterSidebar } from '../components/jobSeeker/FilterSidebar';
import { JobDetailModal } from '../components/jobSeeker/JobDetailModal'; 
import { AuthModal } from '../components/common/AuthModal';

export function JobsPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { jobs, searchLoading } = useSelector((state) => state.seekerJobs);
  const [selectedJob, setSelectedJob] = useState(null); 
  const [appliedJobs, ] = useState([]); 

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin");

  useEffect(() => {
    const query = searchParams.get('q');
    const location = searchParams.get('location');
    const category = searchParams.get('category');

    if (query || location || category) {
      dispatch(searchJobs({ query, location, category, limit: 50 }));
    }
  }, [searchParams, dispatch]);

  // Handle quick apply
  const handleQuickApply = (job) => {
    // Check if user is signed in
    const isSignedIn = !!localStorage.getItem('token'); 
    
    if (!isSignedIn) {
      setAuthModalMode("signin");
      setShowAuthModal(true);
      return;
    }
    
    setSelectedJob(job); // Open modal with apply section
    // Or directly open apply modal
  };

  // Check if job is already applied
  const isJobApplied = (jobId) => {
    return appliedJobs.some(app => app.jobId === jobId);
  };

  // Listen for scrollToJob events from navbar suggestions
  useEffect(() => {
    const handleScrollToJob = (event) => {
      const { jobId } = event.detail;
      const element = document.getElementById(`job-${jobId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-indigo-200', 'transition-all', 'duration-500');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-indigo-200');
        }, 2000);
      } else {
        // If job not in current list, navigate to job detail
        window.location.href = `/jobs/${jobId}`;
      }
    };

    window.addEventListener('scrollToJob', handleScrollToJob);
    return () => window.removeEventListener('scrollToJob', handleScrollToJob);
  }, []);

  if (searchLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Searching jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3">
            <FilterSidebar />
          </div>
          
          <div className="md:col-span-8 lg:col-span-9">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Search Results
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Found {jobs.length} jobs matching your criteria
              </p>
            </div>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} id={`job-${job._id}`}>
                  <JobCard 
                    job={job}
                    onJobClick={() => setSelectedJob(job)} // Open modal when card is clicked
                    onQuickApply={() => handleQuickApply(job)} // Handle quick apply
                    isApplied={isJobApplied(job._id)} // Check if already applied
                  />
                </div>
              ))}
              
              {jobs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500">No jobs found matching your search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onQuickApply={handleQuickApply}
          isApplied={isJobApplied(selectedJob._id)}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}