'use client';
import React, { useState, useEffect } from 'react';
import JobManagement from '@/components/jobs/JobManagement';
import { getJobs, Job } from '@/services/jobService';

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    // Only run this effect in the browser
    if (!isBrowser) return;

    const fetchJobs = async () => {
      try {
        const data = await getJobs(currentPage);
        setJobs(data.data);
        setTotalPages(data.last_page);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        if (
          error instanceof Error &&
          error.message === 'Authentication required'
        ) {
          setError('Please log in to view and manage job opportunities.');
        } else {
          setError('Failed to load job opportunities. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isBrowser, currentPage]);

  const handleJobsUpdated = () => {
    if (!isBrowser) return;

    setLoading(true);
    getJobs(currentPage)
      .then((data) => {
        setJobs(data.data);
        setTotalPages(data.last_page);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error refreshing jobs:', error);
        setLoading(false);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  // Show a login message if not authenticated
  if (error && error.includes('Please log in')) {
    return (
      <div>
        <h1 className="text-3xl font-bold my-6 text-center">
          Manage Job Posts
        </h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="mb-4">{error}</p>
          <a
            href="/auth/login"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold my-6 text-center">Manage Job Posts</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading && isBrowser ? (
        <div className="flex justify-center p-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4"></div>
            <p className="text-gray-500">Loading job opportunities...</p>
          </div>
        </div>
      ) : (
        <JobManagement
          jobs={jobs}
          onJobsUpdated={handleJobsUpdated}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default JobsPage;
