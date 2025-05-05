'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user role from localStorage on the client side
    const checkUserRole = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Redirect or show error if not admin or instructor
  if (!userRole || (userRole !== 'admin' && userRole !== 'instructor')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access this area.
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold my-6 text-center">
        {userRole === 'admin' ? 'Admin Dashboard' : 'Instructor Dashboard'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/courses"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          <p className="text-gray-600">
            Manage your courses and course content
          </p>
        </Link>
        {userRole === 'admin' && (
          <Link
            href="/admin/events"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            <p className="text-gray-600">
              Manage upcoming events and workshops
            </p>
          </Link>
        )}
        {userRole === 'admin' && (
          <Link
            href="/admin/jobs"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Job Opportunities</h2>
            <p className="text-gray-600">
              Manage job postings and opportunities
            </p>
          </Link>
        )}
        {userRole === 'admin' && (
          <Link
            href="/admin/mentorship"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Mentorship Programs</h2>
            <p className="text-gray-600">
              Manage mentorship programs and mentors
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
