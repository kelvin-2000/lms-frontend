import React from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

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

        <Link
          href="/admin/events"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Events</h2>
          <p className="text-gray-600">Manage upcoming events and workshops</p>
        </Link>

        <Link
          href="/admin/jobs"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Job Opportunities</h2>
          <p className="text-gray-600">Manage job postings and opportunities</p>
        </Link>

        <Link
          href="/admin/mentorship"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Mentorship Programs</h2>
          <p className="text-gray-600">
            Manage mentorship programs and mentors
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
