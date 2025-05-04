'use client';
import JobCard from '@/components/jobs/JobCard';
import { JobOpportunity } from '@/types/jobs';
import { useState, useEffect, ChangeEvent } from 'react';

interface ApiResponse {
  success: boolean;
  data: JobOpportunity[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    location_type: '',
    experience: '',
    search: '',
  });
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...(filters.type && { type: filters.type }),
          ...(filters.location_type && {
            location_type: filters.location_type,
          }),
          ...(filters.experience && { experience: filters.experience }),
          ...(filters.search && { search: filters.search }),
        });

        const response = await fetch(
          `http://127.0.0.1:8000/api/job-opportunities/open?${queryParams}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data: ApiResponse = await response.json();
        setJobs(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters.type, filters.location_type, filters.experience]);

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...(filters.type && { type: filters.type }),
          ...(filters.location_type && {
            location_type: filters.location_type,
          }),
          ...(filters.experience && { experience: filters.experience }),
          ...(value && { search: value }),
        });

        const response = await fetch(
          `http://127.0.0.1:8000/api/job-opportunities/open?${queryParams}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data: ApiResponse = await response.json();
        setJobs(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Job Opportunities
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover career opportunities that match your skills and aspirations
            in tech, development, and design.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              <select
                name="location_type"
                value={filters.location_type}
                onChange={handleFilterChange}
                className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Work Location Types</option>
                <option value="on-site">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Experience Level</option>
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior-level">Senior Level</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs?.data?.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary_range={job.salary_range}
              jobType={job.jobType}
              deadline={job.deadline}
              postedDate={job.postedDate}
              description={job.description}
              requirements={job.requirements}
              created_at={job.created_at}
              updated_at={job.updated_at}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <a
              href="#"
              className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-gray-50"
            >
              1
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              2
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              3
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
