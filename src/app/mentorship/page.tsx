'use client';
import MentorshipCard from '@/components/mentorship/MentorshipCard';
import {
  MentorshipService,
  MentorshipProgram,
  MentorshipFilters,
} from '@/services/mentorship.service';
import { useEffect, useState, ChangeEvent } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function MentorshipPage() {
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MentorshipFilters>({
    category: '',
    status: '',
    duration: '',
    search: '',
  });

  // Debounce the search value
  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const mentorshipService = new MentorshipService();
        const data = await mentorshipService.getOpenPrograms({
          ...filters,
          search: debouncedSearch,
        });
        setPrograms(data);
      } catch (error) {
        console.error('Error fetching mentorship programs:', error);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [filters.category, filters.status, filters.duration, debouncedSearch]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Mentorship Programs
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with experienced mentors who can guide you on your learning
            journey and help you achieve your career goals.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How Mentorship Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600">
                Browse through available mentorship programs and apply to the
                ones that match your goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Match</h3>
              <p className="text-gray-600">
                If selected, you&apos;ll be matched with your mentor and receive
                a program schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Grow</h3>
              <p className="text-gray-600">
                Attend regular sessions, complete assignments, and receive
                personalized guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="database">Database</option>
                <option value="design">UI/UX Design</option>
                <option value="career">Career Guidance</option>
                <option value="other">Other</option>
              </select>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
              </select>
              <select
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Duration</option>
                <option value="short">1-2 Months</option>
                <option value="medium">3-4 Months</option>
                <option value="long">5+ Months</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search mentorships..."
                className="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
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

        {/* Mentorships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.length > 0 ? (
            programs.map((program) => (
              <MentorshipCard
                key={program.id}
                {...program}
                mentorName={program.mentor?.name || 'Unknown Mentor'}
                mentorAvatar={
                  program.mentor?.avatar || '/assets/default-avatar.png'
                }
                mentorTitle={program.mentor?.title || 'Mentor'}
                status={program.status}
                capacity={program.capacity}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center">
              <p className="text-lg text-gray-600">
                No mentorship programs found matching your criteria.
              </p>
              <p className="mt-2 text-md text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>

        {/* Become a Mentor CTA */}
        {/* <div className="mt-16 bg-indigo-600 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Want to Share Your Knowledge?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            If you&apos;re an experienced professional looking to give back to
            the community, consider becoming a mentor.
          </p>
          <a
            href="/mentorship/apply"
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Apply to Become a Mentor
          </a>
        </div> */}
      </div>
    </div>
  );
}
