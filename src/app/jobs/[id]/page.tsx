'use client';
import React, { useState, useEffect } from 'react';
import { getJobById, Job } from '@/services/jobService';
import Link from 'next/link';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(params.id);
        setJob(jobData);
      } catch (error) {
        console.error('Error fetching job details:', error);
        if (
          error instanceof Error &&
          error.message === 'Authentication required'
        ) {
          setError('Please log in to view this job opportunity.');
        } else {
          setError(
            'Failed to load job details. The job may no longer be available.',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const handleApply = () => {
    if (job?.application_url) {
      window.open(job.application_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center p-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4"></div>
            <p className="text-gray-500">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Job not found. The job may have been removed or is no longer
                available.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <Link
                href="/jobs"
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                Jobs
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className="ml-2 text-gray-700 font-medium truncate"
                title={job.title}
              >
                {job.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <p className="mt-1 text-lg text-gray-600">{job.company}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Key details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-base font-medium">{job.location}</p>
                  <p className="text-sm text-gray-500">
                    ({job.work_location_type})
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="text-base font-medium">
                    {job.job_type.charAt(0).toUpperCase() +
                      job.job_type.slice(1).replace('-', ' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {job.experience_level.replace('-', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Application Deadline</p>
                  <p className="text-base font-medium">
                    {new Date(job.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(job.deadline) > new Date()
                      ? `${Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                      : 'Deadline passed'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Salary</h2>
              <p className="text-lg font-medium text-indigo-600">
                {job.salary_range}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-indigo max-w-none">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <div className="prose prose-indigo max-w-none">
                <p className="whitespace-pre-line">{job.requirements}</p>
              </div>
            </div>

            {/* Posted date */}
            <div className="text-sm text-gray-500 mb-8">
              <p>
                Posted on{' '}
                {job.created_at
                  ? new Date(job.created_at).toLocaleDateString()
                  : 'Unknown date'}
              </p>
              {job.updated_at &&
                job.created_at &&
                job.updated_at !== job.created_at && (
                  <p>
                    Last updated on{' '}
                    {new Date(job.updated_at).toLocaleDateString()}
                  </p>
                )}
            </div>

            {/* Apply button */}
            <div className="flex justify-between items-center">
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="h-5 w-5 mr-2 -ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to All Jobs
              </Link>
              <button
                onClick={handleApply}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply Now
                <svg
                  className="h-5 w-5 ml-2 -mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
