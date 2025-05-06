'use client';

import Link from 'next/link';
import Image from 'next/image';
import '@/styles/globals.css';
import { useState, useEffect } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user data from localStorage on the client side
    const checkUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserData();
  }, []);

  // Show a minimal loading state or just render the page without user-specific elements
  if (isLoading) {
    return (
      <div>
        {/* Hero Section with loading state for user-specific elements */}
        <section className="bg-gradient-to-r from-indigo-600 to-[#888CEF] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Learn, Connect, and Grow Your Career
                </h1>
                <p className="text-xl mb-8 text-indigo-100">
                  Your all-in-one platform for online courses, events, job
                  opportunities, and mentorship programs.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/courses"
                    className="px-5 pt-[10px] pb-2 text-lg bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Explore Courses
                  </Link>
                  {/* Join Now button will be conditionally rendered after loading */}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative h-full overflow-hidden w-full">
                  <Image
                    src="/assets/hero.png"
                    alt="Learning platform hero"
                    width={800}
                    height={600}
                    className="rounded-lg object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the page without user-specific elements */}
        {/* Features Section */}
        {/* ... */}
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-[#888CEF] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Learn, Connect, and Grow Your Career
              </h1>
              <p className="text-xl mb-8 text-indigo-100">
                Your all-in-one platform for online courses, events, job
                opportunities, and mentorship programs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="px-5 pt-[10px] pb-2 text-lg bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Explore Courses
                </Link>
                {!user && (
                  <Link
                    href="/auth/register"
                    className="px-5 py-2 text-lg bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Join Now
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-full overflow-hidden w-full">
                <Image
                  src="/assets/hero.png"
                  alt="Learning platform hero"
                  width={800}
                  height={600}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#4f46e5]">
              Everything You Need in One Place
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our platform offers a comprehensive suite of tools to accelerate
              your learning and career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Course Feature */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Courses
              </h3>
              <p className="text-gray-600 mb-4">
                Access hundreds of professionally-crafted courses with video
                content and interactive discussions.
              </p>
              <Link
                href="/courses"
                className="text-indigo-600 font-medium hover:text-indigo-700 inline-flex items-center"
              >
                Browse Courses
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>

            {/* Events Feature */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Virtual Events
              </h3>
              <p className="text-gray-600 mb-4">
                Participate in webinars, workshops, and conferences to expand
                your network and knowledge.
              </p>
              <Link
                href="/events"
                className="text-indigo-600 font-medium hover:text-indigo-700 inline-flex items-center"
              >
                See Upcoming Events
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>

            {/* Jobs Feature */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Job Opportunities
              </h3>
              <p className="text-gray-600 mb-4">
                Find and apply to relevant job openings that match your skills
                and career aspirations.
              </p>
              <Link
                href="/jobs"
                className="text-indigo-600 font-medium hover:text-indigo-700 inline-flex items-center"
              >
                Explore Jobs
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>

            {/* Mentorship Feature */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mentorship Programs
              </h3>
              <p className="text-gray-600 mb-4">
                Connect with industry experts who can guide you toward achieving
                your professional goals.
              </p>
              <Link
                href="/mentorship"
                className="text-indigo-600 font-medium hover:text-indigo-700 inline-flex items-center"
              >
                Find a Mentor
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of learners who have transformed their careers
            through our platform.
          </p>
          {!user ? (
            <Link
              href="/auth/register"
              className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Sign Up for Free
            </Link>
          ) : (
            <Link
              href="/courses"
              className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Continue Learning
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
