'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/auth.service';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, clearAuth } = useAuth();
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuth();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href={
                  isAdmin &&
                  (user?.role === 'admin' || user?.role === 'instructor')
                    ? '/admin'
                    : '/'
                }
                className="text-2xl font-bold text-indigo-600"
              >
                {isAdmin
                  ? user?.role === 'admin'
                    ? 'Admin Dashboard'
                    : user?.role === 'instructor'
                      ? 'Instructor Dashboard'
                      : 'LMS Platform'
                  : 'LMS Platform'}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="space-x-4">
                <Link
                  href={isAdmin ? '/admin/courses' : '/courses'}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive(isAdmin ? '/admin/courses' : '/courses')
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Courses
                </Link>
                <Link
                  href={
                    isAdmin && user?.role === 'admin'
                      ? '/admin/events'
                      : '/events'
                  }
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive(isAdmin ? '/admin/events' : '/events')
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Events
                </Link>
                <Link
                  href={
                    isAdmin && user?.role === 'admin' ? '/admin/jobs' : '/jobs'
                  }
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive(isAdmin ? '/admin/jobs' : '/jobs')
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  href={
                    isAdmin && user?.role === 'admin'
                      ? '/admin/mentorship'
                      : '/mentorship'
                  }
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive(isAdmin ? '/admin/mentorship' : '/mentorship')
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Mentorship
                </Link>
                {user &&
                  (user.role === 'admin' || user.role === 'instructor') &&
                  !isAdmin && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/admin')
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600'
                      }`}
                    >
                      {user?.role === 'admin'
                        ? 'Admin Dashboard'
                        : 'Instructor Dashboard'}
                    </Link>
                  )}
                {isAdmin &&
                  (user?.role === 'admin' || user?.role === 'instructor') && (
                    <Link
                      href="/"
                      className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                    >
                      Back to Home
                    </Link>
                  )}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">
                      Welcome, {user.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-0 rounded-md text-base font-medium text-[red]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="ml-3 px-4 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href={isAdmin ? '/admin/courses' : '/courses'}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(isAdmin ? '/admin/courses' : '/courses')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Courses
            </Link>
            <Link
              href={isAdmin ? '/admin/events' : '/events'}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(isAdmin ? '/admin/events' : '/events')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Events
            </Link>
            <Link
              href={isAdmin ? '/admin/jobs' : '/jobs'}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(isAdmin ? '/admin/jobs' : '/jobs')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Jobs
            </Link>
            <Link
              href={isAdmin ? '/admin/mentorship' : '/mentorship'}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(isAdmin ? '/admin/mentorship' : '/mentorship')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Mentorship
            </Link>
            {user && user.role === 'admin' && !isAdmin && (
              <Link
                href="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/admin')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Admin
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                Back to Site
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">
                      Welcome, {user.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-0 rounded-md text-base font-medium text-[red]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center px-4">
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
