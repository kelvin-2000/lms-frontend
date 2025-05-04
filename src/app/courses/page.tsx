'use client';

import React, { useEffect, useState } from 'react';
import CourseCard from '@/components/courses/CourseCard';
import { Course } from '@/types/courses';

interface Filters {
  category: string;
  level: string;
}

interface ApiResponse {
  data: {
    current_page: number;
    data: Course[];
    last_page: number;
    total: number;
  };
  message: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: '',
    level: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async (page = 1, search = '', filterParams: Filters) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(filterParams.category && { category: filterParams.category }),
        ...(filterParams.level && { level: filterParams.level }),
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/courses?${queryParams}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data: ApiResponse = await response.json();
      setCourses(data.data.data);
      setTotalPages(data.data.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, searchQuery, filters);
  }, [currentPage, searchQuery, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Our Courses
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover a wide range of courses taught by industry experts and
            advance your skills in various domains.
          </p>
        </div>
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="web_development">Web Development</option>
                <option value="mobile_development">Mobile Development</option>
                <option value="design">Design</option>
                <option value="database">Database</option>
              </select>
              <select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="Search by title or instructor name"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-80"
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

        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-600">Error: {error}</div>
          </div>
        ) : (
          <>
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  instructor={course.instructor.name}
                  thumbnailUrl={course.thumbnail}
                  level={course.level}
                  duration={`${Math.round(course.duration / 10080)} weeks`}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                        currentPage === page
                          ? 'text-indigo-600 hover:bg-gray-50'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
