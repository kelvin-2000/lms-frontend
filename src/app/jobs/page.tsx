'use client';
import React, { useState, useEffect } from 'react';
import { getJobs, Job } from '@/services/jobService';
import Link from 'next/link';

const JobCard = ({ job }: { job: Job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              job.status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {job.status}
          </span>
        </div>
        <p className="text-gray-700 font-medium mb-3">{job.company}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">
            {job.job_type}
          </span>
          <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
            {job.experience_level}
          </span>
          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
            {job.work_location_type}
          </span>
        </div>

        <div className="text-sm space-y-2 text-gray-600 mb-4">
          <p>
            <span className="font-semibold">Location:</span> {job.location}
          </p>
          <p>
            <span className="font-semibold">Salary:</span> {job.salary_range}
          </p>
          <p>
            <span className="font-semibold">Apply by:</span>{' '}
            {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-gray-600 line-clamp-3">{job.description}</p>
        </div>

        <div className="flex justify-end">
          <Link
            href={`/jobs/${job.id}`}
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [locationTypes, setLocationTypes] = useState<string[]>([]);

  // Filters
  const [selectedJobType, setSelectedJobType] = useState<string>('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] =
    useState<string>('');
  const [selectedLocationType, setSelectedLocationType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs(currentPage);
        setJobs(data.data);
        setTotalPages(data.last_page);

        // Extract unique filter options from jobs
        const types = Array.from(new Set(data.data.map((job) => job.job_type)));
        const levels = Array.from(
          new Set(data.data.map((job) => job.experience_level)),
        );
        const locations = Array.from(
          new Set(data.data.map((job) => job.work_location_type)),
        );

        setJobTypes(types);
        setExperienceLevels(levels);
        setLocationTypes(locations);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load job opportunities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter jobs based on selected criteria
  const filteredJobs = jobs.filter((job) => {
    return (
      (selectedJobType === '' || job.job_type === selectedJobType) &&
      (selectedExperienceLevel === '' ||
        job.experience_level === selectedExperienceLevel) &&
      (selectedLocationType === '' ||
        job.work_location_type === selectedLocationType) &&
      (searchTerm === '' ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const resetFilters = () => {
    setSelectedJobType('');
    setSelectedExperienceLevel('');
    setSelectedLocationType('');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Job Opportunities
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover your next career opportunity with our partners
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Filter Jobs
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job title, company, or description"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="jobType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Type
              </label>
              <select
                id="jobType"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Job Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="experienceLevel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Experience Level
              </label>
              <select
                id="experienceLevel"
                value={selectedExperienceLevel}
                onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Experience Levels</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() +
                      level.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="locationType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location Type
              </label>
              <select
                id="locationType"
                value={selectedLocationType}
                onChange={(e) => setSelectedLocationType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Location Types</option>
                {locationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4"></div>
            <p className="text-gray-500">Loading job opportunities...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-700">
              Showing {filteredJobs.length} job
              {filteredJobs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No job opportunities found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or check back later for new
                opportunities.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {!searchTerm &&
            !selectedJobType &&
            !selectedExperienceLevel &&
            !selectedLocationType &&
            totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-md ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
        </>
      )}
    </div>
  );
}
